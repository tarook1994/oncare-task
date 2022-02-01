import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const isRequestAuthenticated = (req, res, next) => {
  if (
    (req.url && req.url === "/api/v1/login") ||
    req.url === "/api/v1/register"
  ) {
    return next();
  }
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuthorized = false;
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedToken) {
      req.isAuthorized = false;
      return next();
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
