import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createPatient = async (req: Request, res: Response) => {
  const patient = await prisma.patient.create({
    data: {
      ...req.body,
      createdById: req.user!.id,
    },
  });

  res.status(201).json({ patient });
};

export const getPatients = async (req: Request, res: Response) => {
  const patients = await prisma.patient.findMany({
    where: { createdById: req.user!.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({ patients });
};

export const getPatient = async (req: Request, res: Response) => {
  const patient = await prisma.patient.findFirst({
    where: {
      id: Number(req.params.id),
      createdById: req.user!.id,
    },
    include: {
      mappings: {
        include: { doctor: true },
      },
    },
  });

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  res.json({ patient });
};

export const updatePatient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const existingPatient = await prisma.patient.findFirst({
    where: { id, createdById: req.user!.id },
  });

  if (!existingPatient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: req.body,
  });

  res.json({ patient });
};

export const deletePatient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await prisma.patient.deleteMany({
    where: { id, createdById: req.user!.id },
  });

  if (result.count === 0) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  res.status(204).send();
};
