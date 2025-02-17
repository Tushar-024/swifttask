import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import  ApiError  from "../utils/ApiError";
import  httpStatus from "http-status";

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new ApiError(httpStatus.BAD_REQUEST, error.details[0].message));
    }
    next();
  };
