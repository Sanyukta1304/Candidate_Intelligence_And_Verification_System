const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notification.controller");

const { verifyToken } = require("../middleware/auth");

router.get("/notifications", verifyToken, getNotifications);
// ✅ IMPORTANT: read-all must come BEFORE :id to prevent parameter matching issues
router.put("/notifications/read-all", verifyToken, markAllNotificationsRead);
router.put("/notifications/:id/read", verifyToken, markNotificationRead);

module.exports = router;