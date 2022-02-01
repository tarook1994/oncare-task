import express from "express";
import { registerUser } from "../controllers/registerController.js";
import { validateRegisterBody } from "../utils/validationUtils.js";
export const registerRouter = express.Router();

registerRouter.post("/", validateRegisterBody, registerUser);
