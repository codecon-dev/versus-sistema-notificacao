import { AppDataSource } from "../config/database";
import { Notification } from "../entities/Notification";
import { NotificationRecipient } from "../entities/NotificationRecipient";
import { User } from "../entities/User";
import { rabbitMQService } from "./RabbitMQService";

export class NotificationService {
  private notificationRepo = AppDataSource.getRepository(Notification);
  private recipientRepo = AppDataSource.getRepository(NotificationRecipient);
  private userRepo = AppDataSource.getRepository(User);

  async createAndSend(message: string, userIds: number[], createdBy: string) {
    // Criar notificação
    const notification = this.notificationRepo.create({
      message,
      created_by: createdBy,
    });
    await this.notificationRepo.save(notification);

    // Criar recipients
    const recipients = userIds.map((userId) =>
      this.recipientRepo.create({
        notification_id: notification.id,
        user_id: userId,
        read_at: null,
      }),
    );
    await this.recipientRepo.save(recipients);

    // Publicar na fila RabbitMQ
    await rabbitMQService.publishNotification({
      notificationId: notification.id,
      message: notification.message,
      userIds,
      createdAt: notification.created_at,
    });

    return notification;
  }

  async getUserNotifications(userId: number) {
    const recipients = await this.recipientRepo.find({
      where: { user_id: userId },
      relations: ["notification"],
      order: { received_at: "DESC" },
    });

    return recipients.map((r) => ({
      id: r.id,
      notificationId: r.notification_id,
      message: r.notification.message,
      readAt: r.read_at,
      receivedAt: r.received_at,
      createdAt: r.notification.created_at,
    }));
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.recipientRepo.count({
      where: { user_id: userId, read_at: null },
    });
  }

  async markAsRead(recipientId: number, userId: number) {
    const recipient = await this.recipientRepo.findOne({
      where: { id: recipientId, user_id: userId },
    });

    if (!recipient) {
      throw new Error("Notificação não encontrada");
    }

    recipient.read_at = new Date();
    await this.recipientRepo.save(recipient);

    return recipient;
  }

  async markAllAsRead(userId: number) {
    await this.recipientRepo
      .createQueryBuilder()
      .update(NotificationRecipient)
      .set({ read_at: new Date() })
      .where("user_id = :userId AND read_at IS NULL", { userId })
      .execute();
  }

  async getAllUsers() {
    return this.userRepo.find({
      where: { is_admin: false },
      select: ["id", "username", "created_at"],
    });
  }

  async getDashboardStats() {
    const totalUsers = await this.userRepo.count({
      where: { is_admin: false },
    });

    const totalNotifications = await this.notificationRepo.count();

    const totalRecipients = await this.recipientRepo.count();

    // Usar query builder ao invés de count simples
    const unreadRecipients = await this.recipientRepo
      .createQueryBuilder("recipient")
      .where("recipient.read_at IS NULL")
      .getCount();

    const readRecipients = await this.recipientRepo
      .createQueryBuilder("recipient")
      .where("recipient.read_at IS NOT NULL")
      .getCount();

    console.log("🔍 Debug Counts (RAW):", {
      totalRecipients,
      totalRecipientsType: typeof totalRecipients,
      unreadRecipients,
      unreadRecipientsType: typeof unreadRecipients,
      readRecipients,
      readRecipientsType: typeof readRecipients,
      calculation: `${totalRecipients} - ${unreadRecipients} = ${readRecipients}`,
    });

    // Verificar dados brutos
    const allRecipients = await this.recipientRepo.find({
      select: ["id", "read_at"],
      take: 5,
    });
    console.log(
      "📋 Sample recipients:",
      allRecipients.map((r) => ({ id: r.id, read_at: r.read_at })),
    );

    // Forçar conversão para número
    const totalRecipientsNum = Number(totalRecipients);
    const unreadRecipientsNum = Number(unreadRecipients);
    const readRecipientsNum = Number(readRecipients);

    const readRate =
      totalRecipientsNum > 0
        ? ((readRecipientsNum / totalRecipientsNum) * 100).toFixed(1)
        : "0.0";

    // Notificações enviadas nos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentNotifications = await this.notificationRepo
      .createQueryBuilder("notification")
      .where("notification.created_at >= :sevenDaysAgo", { sevenDaysAgo })
      .getCount();

    // Notificações enviadas hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayNotifications = await this.notificationRepo
      .createQueryBuilder("notification")
      .where("notification.created_at >= :today", { today })
      .getCount();

    // Usuários mais ativos (que mais leem notificações)
    const mostActiveUsersRaw = await this.recipientRepo
      .createQueryBuilder("recipient")
      .select("user.username", "username")
      .addSelect("COUNT(recipient.id)", "readcount")
      .innerJoin("recipient.user", "user")
      .where("recipient.read_at IS NOT NULL")
      .groupBy("user.id")
      .addGroupBy("user.username")
      .orderBy("readcount", "DESC")
      .limit(5)
      .getRawMany();

    const mostActiveUsers = mostActiveUsersRaw.map((user) => ({
      username: user.username,
      readCount: parseInt(user.readcount),
    }));

    // Notificações por dia (últimos 7 dias)
    const notificationsByDayRaw = await this.notificationRepo
      .createQueryBuilder("notification")
      .select("DATE(notification.created_at)::text", "date")
      .addSelect("COUNT(notification.id)", "count")
      .where("notification.created_at >= :sevenDaysAgo", { sevenDaysAgo })
      .groupBy("DATE(notification.created_at)")
      .orderBy("date", "ASC")
      .getRawMany();

    const notificationsByDay = notificationsByDayRaw.map((day) => ({
      date: day.date,
      count: parseInt(day.count),
    }));

    console.log("📊 Dashboard Stats (FINAL):", {
      totalUsers,
      totalNotifications,
      totalRecipients: totalRecipientsNum,
      readRecipients: readRecipientsNum,
      unreadRecipients: unreadRecipientsNum,
      readRate: parseFloat(readRate),
    });

    return {
      totalUsers: Number(totalUsers),
      totalNotifications: Number(totalNotifications),
      totalRecipients: totalRecipientsNum,
      readRecipients: readRecipientsNum,
      unreadRecipients: unreadRecipientsNum,
      readRate: parseFloat(readRate),
      todayNotifications: Number(todayNotifications),
      recentNotifications: Number(recentNotifications),
      mostActiveUsers,
      notificationsByDay,
    };
  }

  async getAllSentNotifications() {
    const notifications = await this.notificationRepo.find({
      order: { created_at: "DESC" },
    });

    const notificationsWithCounts = await Promise.all(
      notifications.map(async (notification) => {
        const totalRecipients = await this.recipientRepo.count({
          where: { notification_id: notification.id },
        });

        const unreadCount = await this.recipientRepo
          .createQueryBuilder("recipient")
          .where("recipient.notification_id = :notificationId", {
            notificationId: notification.id,
          })
          .andWhere("recipient.read_at IS NULL")
          .getCount();

        const readCount = await this.recipientRepo
          .createQueryBuilder("recipient")
          .where("recipient.notification_id = :notificationId", {
            notificationId: notification.id,
          })
          .andWhere("recipient.read_at IS NOT NULL")
          .getCount();

        const totalNum = Number(totalRecipients);
        const readNum = Number(readCount);
        const unreadNum = Number(unreadCount);

        return {
          id: notification.id,
          message: notification.message,
          createdBy: notification.created_by,
          createdAt: notification.created_at,
          totalRecipients: totalNum,
          readCount: readNum,
          unreadCount: unreadNum,
          readRate:
            totalNum > 0 ? ((readNum / totalNum) * 100).toFixed(1) : "0.0",
        };
      }),
    );

    return notificationsWithCounts;
  }

  async getNotificationWithRecipients(notificationId: number) {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      return null;
    }

    const recipients = await this.recipientRepo.find({
      where: { notification_id: notificationId },
      relations: ["user"],
      order: { received_at: "DESC" },
    });

    return {
      id: notification.id,
      message: notification.message,
      createdBy: notification.created_by,
      createdAt: notification.created_at,
      recipients: recipients.map((r) => ({
        id: r.id,
        userId: r.user_id,
        username: r.user.username,
        receivedAt: r.received_at,
        readAt: r.read_at,
        status: r.read_at ? "Lida" : "Não lida",
      })),
    };
  }
}

export const notificationService = new NotificationService();
