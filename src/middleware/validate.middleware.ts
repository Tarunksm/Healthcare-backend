import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

export const validate = (Schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = Schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid inputs",
        error: result.error,
      });
    }
    next();
  };
};
