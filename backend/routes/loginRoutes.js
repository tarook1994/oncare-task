import express from "express";
import {
  loginUser,
  refreshTokens,
} from "../controllers/authenticationController.js";
export const loginRouter = express.Router();

loginRouter.post("/", loginUser);
