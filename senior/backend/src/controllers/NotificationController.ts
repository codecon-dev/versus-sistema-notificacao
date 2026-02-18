import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { notificationService } from "../services/NotificationService";

export class NotificationController {
  async getMyNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const notifications =
        await notificationService.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      res.status(500).json({ error: "Erro ao buscar notificações" });
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Erro ao buscar contador:", error);
      res.status(500).json({ error: "Erro ao buscar contador" });
    }
  }

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      await notificationService.markAsRead(parseInt(id), userId);
      res.json({ message: "Notificação marcada como lida" });
    } catch (error: any) {
      console.error("Erro ao marcar como lida:", error);
      res
        .status(500)
        .json({ error: error.message || "Erro ao marcar como lida" });
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      await notificationService.markAllAsRead(userId);
      res.json({ message: "Todas as notificações marcadas como lidas" });
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      res.status(500).json({ error: "Erro ao marcar todas como lidas" });
    }
  }
}

export const notificationController = new NotificationController();
