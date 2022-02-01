import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { isRequestAuthenticated } from "./utils/authenticationUtility.js";
import { registerRouter } from "./routes/registerRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { loginRouter } from "./routes/loginRoutes.js";
import { authenticationRouter } from "./routes/authenticationRoutes.js";

const initializeServer = async () => {
  const app = express();
  dotenv.config();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /* Allow CORS just for the sake of the example */
  app.use(cors());
  app.use(isRequestAuthenticated);

  app.use("/api/v1/login", loginRouter);
  app.use("/api/v1/refresh-tokens", authenticationRouter);
  app.use("/api/v1/register", registerRouter);
  app.use("/api/v1/users", userRouter);

  const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      dialect: "mysql",
      /* Using port 3307 to aviod port conflict with other database instances on your machine */
      port: 3307,
    }
  );
  try {
    await sequelize.sync();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
};

initializeServer();
