const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notification.controller");

const { verifyToken } = require("../middleware/auth");

router.get("/notifications", verifyToken, getNotifications);
router.put("/notifications/:id/read", verifyToken, markNotificationRead);
router.put("/notifications/read-all", verifyToken, markAllNotificationsRead);

module.exports = router;