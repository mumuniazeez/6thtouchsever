import Report from "../../models/Report.js";

/**
 * User Create Report
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const createReport = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, message } = req.body;

    const report = await Report.create({
      title,
      message,
      userId: id,
    });

    if (!report)
      return res.status(401).json({
        message: "Error creating report",
      });

    res.json({
      message: "Report created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error creating report",
    });
  }
};
