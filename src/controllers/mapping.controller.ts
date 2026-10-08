import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const createMapping = async (req: Request, res: Response) => {
  const { patientId, doctorId } = req.body;

  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
      createdById: req.user!.id,
    },
  });

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  const mapping = await prisma.patientDoctorMapping.create({
    data: { patientId, doctorId },
    include: {
      patient: true,
      doctor: true,
    },
  });

  res.status(201).json({ mapping });
};

export const getMappings = async (req: Request, res: Response) => {
  const mappings = await prisma.patientDoctorMapping.findMany({
    where: {
      patient: { createdById: req.user!.id },
    },
    include: {
      patient: true,
      doctor: true,
    },
  });

  res.json({ mappings });
};

export const getPatientMappings = async (req: Request, res: Response) => {
  const patientId = Number(req.params.patientId);

  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
      createdById: req.user!.id,
    },
  });

  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }

  const mappings = await prisma.patientDoctorMapping.findMany({
    where: { patientId },
    include: { doctor: true },
  });

  res.json({ mappings });
};

export const deleteMapping = async (req: Request, res: Response) => {
  const result = await prisma.patientDoctorMapping.deleteMany({
    where: {
      id: Number(req.params.id),
      patient: { createdById: req.user!.id },
    },
  });

  if (result.count === 0) {
    res.status(404).json({ error: "Mapping not found" });
    return;
  }

  res.status(204).send();
};
