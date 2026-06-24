const notificationService = require("../services/notificationService");

const listNotifications = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const notifications = await notificationService.listNotifications(req.user._id, { limit });
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id, req.user._id);
    return res.status(200).json({ notification });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await notificationService.markAllRead(req.user._id);
    return res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
};
