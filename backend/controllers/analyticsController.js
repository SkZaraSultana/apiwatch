const analyticsService = require("../services/analyticsService");

const getAnalytics = async (req, res) => {
  try {
    const { range, monitorId } = req.query;
    const data = await analyticsService.getAnalytics(req.user._id, {
      range,
      monitorId: monitorId || null,
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
};
