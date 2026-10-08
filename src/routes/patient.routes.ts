import { Router } from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "../controllers/patient.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { patientSchema } from "../validators/schema.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(patientSchema), createPatient);
router.get("/", getPatients);
router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
