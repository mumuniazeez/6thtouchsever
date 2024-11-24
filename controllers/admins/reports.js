import Report from "../../models/Report.js";

/**
 * Admin get all reports controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: { all: true },
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
/**
 * Admin get report by id controller
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getReportsById = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findByPk(reportId, {
      include: { all: true },
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
