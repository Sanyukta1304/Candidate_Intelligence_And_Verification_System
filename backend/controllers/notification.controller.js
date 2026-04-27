const Notification = require("../models/Notifications");
const Candidate = require("../models/Candidate");

const getNotifications = async (req, res) => {
  try {
    // Current logged-in candidate's profile
    const candidate = await Candidate.findOne({ user_id: req.user.id });

    if (!candidate) {
      return res.status(404).json({ 
        success: false,
        message: "Candidate profile not found" 
      });
    }

    const notifications = await Notification.find({
      recipient_id: req.user.id,
    }).sort({ createdAt: -1 });

    // Transform notifications to include human-readable message
    const transformedNotifications = notifications.map(notif => {
      let message = '';
      
      if (notif.type === 'profile_viewed') {
        message = `${notif.recruiter_name || 'A recruiter'} from ${notif.company_name || 'Unknown Company'} viewed your profile`;
      } else if (notif.type === 'profile_starred') {
        message = `${notif.recruiter_name || 'A recruiter'} from ${notif.company_name || 'Unknown Company'} starred your profile`;
      }

      return {
        _id: notif._id,
        type: notif.type,
        message,
        recruiter_name: notif.recruiter_name,
        company_name: notif.company_name,
        read: notif.read,
        createdAt: notif.createdAt
      };
    });

    res.status(200).json({
      success: true,
      data: transformedNotifications
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient_id: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient_id: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};