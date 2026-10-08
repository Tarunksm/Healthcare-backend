import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(401).send("Email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      return res.status(401).send("Email does not exist! Register first");
    }
    const isPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );
    if (!isPassword) {
      return res.status(401).send("Incorrect password");
    }
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );
    res.json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};
