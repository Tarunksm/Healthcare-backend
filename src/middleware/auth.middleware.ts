import "dotenv/config";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) {
    return res.status(401).send("Token not provided");
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).send("Token not provided");
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).send("JWT_SECRET not configured");
    }
    const decoded = jwt.verify(token, jwtSecret as string);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send("Invalid token");
  }

  next();
};
