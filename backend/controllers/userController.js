import bcrypt from "bcryptjs";
import { db } from "../models/index.js";

export const deleteUser = async (req, res, next) => {
  const User = db.users;
  const id = req.params.id;
  try {
    const deletedUser = await User.destroy({
      where: { id: id },
    });
    return res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error deleting user" });
  }
};

export const updateUser = async (req, res, next) => {
  const User = db.users;
  const id = req.params.id;

  try {
    const updatedUser = await User.update(req.body, {
      where: { id: id },
      returning: true,
    });
    const updatedUserObject = updatedUser.dataValues;
    console.log(updatedUser);
    return res.status(200).json({ user: updatedUserObject });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error updating user" });
  }
};

export const getAllUsers = async (req, res, next) => {
  const User = db.users;
  const page = req.query.page;
  const limit = 25;
  try {
    const totalUsers = await User.count({});
    const numberOfPages = Math.ceil(totalUsers / limit);
    const users = await User.findAll({
      attributes: ["first_name", "last_name", "email", "id"],
      limit,
      offset: parseInt(page) * limit,
    });

    return res.status(200).json({ users, numberOfPages, totalUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error getting user" });
  }
};
