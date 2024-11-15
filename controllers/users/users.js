import Users from "../../models/Users.js";

export const myProfile = async (req, res) => {
  try {
    let { id } = req.user;

    let user = await Users.findByPk(id);

    // check if there no user with the given id
    // if (!user)
    // 404
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });
    // return the user data with the given id
    // res.send(user)
    // 200
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting user profile",
    });
  }
};

export const deleteMyProfile = async (req, res) => {
  try {
    // Destructure the id from the req.user
    let { id } = req.user;

    // delete the user from the database
    let user = await Users.destroy({
      where: { id },
    });

    // check if the user was deleted
    // i.e result.rowCount < 1
    // 400
    if (user < 1)
      return res.status(400).json({
        message: "Error deleteing the account",
      });

    // send deleted message back to the frontend
    // 200
    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    let { id } = req.user;
    let { firstName, lastName, email, password } = req.body;

    let user = await Users.update(
      {
        firstName,
        lastName,
        email,
        password,
      },
      {
        where: { id },
      }
    );
    if (user[0] < 1)
      return res.status(401).json({
        message: "Error updating account",
      });

    res.status(200).json({
      message: "Account updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating account",
    });
  }
};
