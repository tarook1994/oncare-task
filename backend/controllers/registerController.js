import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../models/index.js";

export const registerUser = async (req, res, next) => {
  const User = db.users;
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(12)
    );
    const createdUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      user_password: hashedPassword,
    });
    const userObject = createdUser.dataValues;
    const accessToken = jwt.sign(
      { userId: userObject.id, name: userObject.first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    const refreshToken = jwt.sign(
      { userId: userObject._id, name: userObject.first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "90d",
      }
    );

    return res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error creating user" });
  }
};
