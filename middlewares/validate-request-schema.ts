import { NextFunction, Request, Response } from "express";
import { validationResult, body } from "express-validator";
import AppError from "../utils/appError";

export function validateRequestSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: any[] = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
}
