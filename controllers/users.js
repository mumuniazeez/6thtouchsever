import { db } from "../util/util.js";

export const myProfile = async (req, res) => {
  try {
    let { id } = req.user;
    // get the user from the database using the id
    // i.e WHERE id = $1
    let query = `SELECT * FROM users WHERE id = $1`;
    let values = [id];
    let result = await db.query(query, values);
    let user = result.rows[0];

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
    let query = `DELETE FROM users WHERE id = $1`;
    let values = [id];
    let result = await db.query(query, values);

    // check if the user was deleted
    // i.e result.rowCount < 1
    // 400
    if (result.rowCount < 1)
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

export const editProfile =  async (req, res) => {
  try {
    let { id } = req.user;
    let { firstname, lastname, email, password } = req.body;

    let query = `UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4
    WHERE id = $5
  `;
    let values = [firstname, lastname, email, password, id];
    let result = await db.query(query, values);

    if (result.rowCount < 1)
      return res.status(401).json({
        message: "Error updating account",
      });
    
    res.status(200).json({
        message:"Account updated successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "Error updating account",
    })
  }
}