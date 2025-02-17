import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import ApiError  from "../utils/ApiError";

import httpStatus from "http-status";

export interface AuthRequest extends Request {
  user?: any; // You can define a proper user type here
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "No token provided");
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
  }
};
