import { Router } from "express";
import {
  createMapping,
  deleteMapping,
  getMappings,
  getPatientMappings,
} from "../controllers/mapping.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createMapping);
router.get("/", getMappings);

router.get("/:patientId", getPatientMappings);

router.delete("/:id", deleteMapping);

export default router;
