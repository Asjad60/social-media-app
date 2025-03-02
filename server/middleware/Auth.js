import jwt from "jsonwebtoken";
import { AppError } from "./Error.middleware.js";

export const auth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;
    // req.headers["authorization"]?.replace("Bearer ", "")  this will also work
    // console.log("token => ", token);
    if (!token || token === null) {
      return res.status(400).json({
        success: false,
        message: "Unathorized or token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Somethign went wrong while verifying token",
    });
  }
};

export const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);
    const token = socket.request.cookies.token;
    if (!token) {
      return next(new AppError("Please Login to Access This Route", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decodedData;

    return next();
  } catch (error) {
    console.log(error);
    return next(new AppError("Please login to access this route", 401));
  }
};
