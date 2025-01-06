import User from "../../models/User.js";
import { del, put } from "@vercel/blob";

/**
 * Get user profile
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getMyProfile = async (req, res) => {
  try {
    let { id } = req.user;

    let user = await User.findByPk(id, {
      include: { all: true },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting profile",
      error,
    });
  }
};

/**
 * Edit user profile
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const editMyProfile = async (req, res) => {
  try {
    let { id } = req.user;
    let { firstName, lastName, email } = req.body;

    let [affectedRows] = await User.update(
      {
        firstName,
        lastName,
        email,
      },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows < 1)
      return res.status(404).json({
        message: "User profile not edited",
      });

    res.status(200).json({
      message: "User profile edited successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error editing profile",
      error,
    });
  }
};

/**
 * Delete user profile
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const deleteMyProfile = async (req, res) => {
  try {
    let { id } = req.user;

    let deletedRows = await User.destroy({
      where: { id },
      force: true,
    });

    if (deletedRows < 1)
      return res.status(404).json({
        message: "User account not deleted",
      });

    res.status(200).json({
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting profile",
      error,
    });
  }
};

/**
 * Change user profile avatar
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const changeAvatar = async (req, res) => {
  try {
    let { id } = req.user;
    let { buffer, mimetype } = req.file;

    let user = await User.findByPk(id);

    if (!user)
      return res.status(404).json({
        message: "User account not found",
      });

    if (user.avatar) await del(user.avatar);
    const { url } = await put(`/avatars/users/avatar`, buffer, {
      contentType: mimetype,
      access: "public",
    });
    await user.update({
      avatar: url,
    });
    res.status(200).json({
      message: "Avatar successfully uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading avatar",
      error,
    });
  }
};
