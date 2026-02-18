import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { notificationService } from "../services/NotificationService";

export class AdminController {
  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const stats = await notificationService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  }

  async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await notificationService.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  async sendNotification(req: AuthRequest, res: Response) {
    try {
      const { message, userIds } = req.body;

      if (
        !message ||
        !userIds ||
        !Array.isArray(userIds) ||
        userIds.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Mensagem e usuários são obrigatórios" });
      }

      const notification = await notificationService.createAndSend(
        message,
        userIds,
        req.user!.username,
      );

      res.status(201).json({
        message: "Notificação enviada com sucesso",
        notification,
      });
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
      res.status(500).json({ error: "Erro ao enviar notificação" });
    }
  }

  async getSentNotifications(req: AuthRequest, res: Response) {
    try {
      const notifications = await notificationService.getAllSentNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Erro ao buscar notificações enviadas:", error);
      res.status(500).json({ error: "Erro ao buscar notificações enviadas" });
    }
  }

  async getNotificationDetails(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const details = await notificationService.getNotificationWithRecipients(
        parseInt(id),
      );

      if (!details) {
        return res.status(404).json({ error: "Notificação não encontrada" });
      }

      res.json(details);
    } catch (error) {
      console.error("Erro ao buscar detalhes da notificação:", error);
      res.status(500).json({ error: "Erro ao buscar detalhes da notificação" });
    }
  }
}

export const adminController = new AdminController();
