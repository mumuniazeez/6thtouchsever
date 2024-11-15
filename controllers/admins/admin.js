import Admins from "../../models/admins.js";


export const getAdminProfile = async (req, res) => {
  try {
    let { id } = req.admin;

    let admin = await Admins.findByPk(id);

    if (!admin)
      return res.status(404).json({
        message: "Admin not found",
      });

    res.status(200).json(admin);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting admin profile",
    });
  }
};
