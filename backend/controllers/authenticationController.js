import bcrypt from "bcryptjs";
import { db } from "../models/index.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const User = db.users;
    const userRequestingLogin = await User.findOne({ where: { email } });
    const thisUser = userRequestingLogin.dataValues;
    if (!thisUser) {
      throw new Error("User Not Found!");
    }
    const validPassword = await bcrypt.compare(
      password,
      thisUser.user_password
    );
    if (!validPassword) {
      throw new Error("Incorrect password.");
    }
    const accessToken = jwt.sign(
      { userId: thisUser.id, name: thisUser.first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );
    const refreshToken = jwt.sign(
      { userId: thisUser.id, name: thisUser.first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: `Error loging in! ${error.message}` });
  }
};

export const refreshTokens = async (req, res, next) => {
  try {
    const { userId } = req;
    const userRequestingRefresh = await User.findOne({ where: { id: userId } });
    const thisUser = userRequestingRefresh.dataValues;
    if (!thisUser) {
      throw new Error("User Not Found!");
    }

    const accessToken = jwt.sign(
      { userId: thisUser.id, name: thisUser.first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );
    const refreshToken = jwt.sign(
      { userId: thisUser.id, name: thisUser.first_name },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: `Error Refreshing tokens! ${error.message}` });
  }
};
