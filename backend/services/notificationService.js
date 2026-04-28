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

    // Emit real-time notification to the recipient's socket.io room
    // recipient_id must be converted to string for socket.io room joining
    if (ioInstance) {
      const recipientRoom = recipient_id.toString();
      ioInstance.to(recipientRoom).emit("notification", notification);
      console.log(`📤 Notification emitted to room: ${recipientRoom}`);
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