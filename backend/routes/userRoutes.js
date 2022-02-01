import express from "express";
import { registerUser } from "../controllers/registerController.js";
import {
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";
export const userRouter = express.Router();

userRouter.put("/update/:id", updateUser);
userRouter.get("/:id", registerUser);
userRouter.get("/", getAllUsers);
userRouter.delete("/:id", deleteUser);
