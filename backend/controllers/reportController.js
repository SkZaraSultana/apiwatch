const reportService = require("../services/reportService");

const sanitizeReportRecord = (record) => ({
  id: record._id,
  period: record.period,
  format: record.format,
  fileName: record.fileName,
  summary: record.summary,
  generatedAt: record.generatedAt,
});

const getPreview = async (req, res) => {
  try {
    const period = req.query.period || "daily";
    const report = await reportService.getReportPreview(req.user._id, period);
    return res.status(200).json({ report });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const exportReport = async (req, res) => {
  try {
    const period = req.query.period || "daily";
    const format = req.query.format || "pdf";
    const file = await reportService.exportReport(req.user._id, period, format);

    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
    return res.status(200).send(file.buffer);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const records = await reportService.listReportHistory(req.user._id, req.query.limit);
    return res.status(200).json({
      reports: records.map(sanitizeReportRecord),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPreview,
  exportReport,
  getHistory,
};
