const Notification = require("../models/Notification");
const { getIo } = require("./socketService");

const createNotification = async ({ userId, type, title, message, referenceId, metadata }) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    referenceId,
    metadata,
  });

  // emit socket event
  try {
    const io = getIo();
    if (io) {
      io.emit("notification:created", {
        id: notification._id,
        user: notification.user,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        referenceId: notification.referenceId,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to emit notification:created:", err.message);
  }

  return notification;
};

const listNotifications = async (userId, { limit = 50 } = {}) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 200));
};

const markNotificationRead = async (notificationId, userId) => {
  const n = await Notification.findOne({ _id: notificationId, user: userId });
  if (!n) throw new Error("Notification not found.");
  n.isRead = true;
  await n.save();
  return n;
};

const markAllRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};

module.exports = {
  createNotification,
  listNotifications,
  markNotificationRead,
  markAllRead,
};
