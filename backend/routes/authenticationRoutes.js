import express from "express";
import { refreshTokens } from "../controllers/authenticationController.js";
export const authenticationRouter = express.Router();

authenticationRouter.post("/", refreshTokens);
