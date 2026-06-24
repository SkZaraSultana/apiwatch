const dashboardService = require("../services/dashboardService");

const getDashboardOverview = async (req, res) => {
  try {
    const overview = await dashboardService.getDashboardOverview(req.user._id);
    return res.status(200).json(overview);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardOverview,
};
