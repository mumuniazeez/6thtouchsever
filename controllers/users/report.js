import Report from "../../models/reports";

const makeReport = async (req, res) => {
  try {
    const { id } = req.user;
    const { title, message } = req.body;

    const report = await Report.create({
      title,
      message,
      UserId: id,
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
