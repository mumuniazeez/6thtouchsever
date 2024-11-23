import Report from "../../models/Report.js";
import User from "../../models/User.js";

export const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: { model: User, },
    });

    if (reports.length === 0)
      return res.status(404).json({
        message: "No reports found",
      });

    res.json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting reports",
    });
  }
};
export const getReportsById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findByPk(reportId, {
      include: { model: User, },
    });

    if (!report)
      return res.status(404).json({
        message: "Report not found",
      });

    res.json(report);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting reports",
    });
  }
};
