import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createDoctor = async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.create({
    data: req.body,
  });

  res.status(201).json({ doctor });
};

export const getDoctors = async (_req: Request, res: Response) => {
  const doctors = await prisma.doctor.findMany({
    orderBy: { name: "asc" },
  });

  res.json({ doctors });
};

export const getDoctor = async (req: Request, res: Response) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      mappings: {
        include: { patient: true },
      },
    },
  });

  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.json({ doctor });
};

export const updateDoctor = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existingDoctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!existingDoctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: req.body,
  });

  res.json({ doctor });
};

export const deleteDoctor = async (req: Request, res: Response) => {
  const result = await prisma.doctor.deleteMany({
    where: { id: Number(req.params.id) },
  });

  if (result.count === 0) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.status(204).send();
};
