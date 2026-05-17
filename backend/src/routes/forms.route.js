import express from "express";
import {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  submitForm,
  getFormSubmissions,
} from "../controllers/form.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", requireAuth, getAllForms);
router.post("/", requireAuth, createForm);

router.get("/:id", getFormById);
router.put("/:id", requireAuth, updateForm);
router.delete("/:id", requireAuth, deleteForm);

router.get("/:id/submissions", requireAuth, getFormSubmissions);
router.post("/:id/submit", submitForm);

export default router;
