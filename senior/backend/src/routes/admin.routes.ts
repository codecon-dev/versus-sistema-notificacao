import { Router } from "express";
import { adminController } from "../controllers/AdminController";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", (req, res) =>
  adminController.getDashboardStats(req, res),
);
router.get("/users", (req, res) => adminController.getUsers(req, res));
router.post("/notifications", (req, res) =>
  adminController.sendNotification(req, res),
);
router.get("/notifications", (req, res) =>
  adminController.getSentNotifications(req, res),
);
router.get("/notifications/:id", (req, res) =>
  adminController.getNotificationDetails(req, res),
);

export default router;
