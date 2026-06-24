const statusPageService = require("../services/statusPageService");

const getPublicStatus = async (req, res) => {
  try {
    const status = await statusPageService.getPublicStatus(req.params.slug);
    return res.status(200).json(status);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getMyStatusPage = async (req, res) => {
  try {
    const page = await statusPageService.getStatusPageForUser(req.user._id);
    return res.status(200).json({ statusPage: page });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const generateStatusPage = async (req, res) => {
  try {
    const page = await statusPageService.regenerateSlug(req.user._id);
    const payload = await statusPageService.getStatusPageForUser(req.user._id);
    return res.status(200).json({
      message: "Public status URL generated.",
      statusPage: payload,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateStatusPage = async (req, res) => {
  try {
    await statusPageService.updateStatusPage(req.user._id, req.body);
    const payload = await statusPageService.getStatusPageForUser(req.user._id);
    return res.status(200).json({
      message: "Status page updated.",
      statusPage: payload,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPublicStatus,
  getMyStatusPage,
  generateStatusPage,
  updateStatusPage,
};
