const Notification = require("../models/Notifications");

let ioInstance = null;

// Call this once from server.js when socket.io is created
const setSocketInstance = (io) => {
  ioInstance = io;
};

// Save notification in DB + emit real-time event
const emitNotification = async ({
  recipient_id,
  type,
  recruiter_id,
  recruiter_name,
  company_name,
}) => {
  try {
    const notification = await Notification.create({
      recipient_id,
      type,
      recruiter_id,
      recruiter_name,
      company_name,
    });

    if (ioInstance) {
      ioInstance.to(recipient_id.toString()).emit("notification", notification);
    }

    return notification;
  } catch (error) {
    console.error("Notification service error:", error.message);
    throw error;
  }
};

module.exports = {
  setSocketInstance,
  emitNotification,
};