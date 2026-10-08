import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctor,
  getDoctors,
  updateDoctor,
} from "../controllers/doctor.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { doctorSchema } from "../validators/schema.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(doctorSchema), createDoctor);
router.get("/", getDoctors);
router.get("/:id", getDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
