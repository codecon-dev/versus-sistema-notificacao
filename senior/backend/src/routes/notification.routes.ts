import { Router } from "express";
import { notificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", (req, res) =>
  notificationController.getMyNotifications(req, res),
);
router.get("/unread-count", (req, res) =>
  notificationController.getUnreadCount(req, res),
);
router.patch("/:id/read", (req, res) =>
  notificationController.markAsRead(req, res),
);
router.patch("/read-all", (req, res) =>
  notificationController.markAllAsRead(req, res),
);

export default router;
