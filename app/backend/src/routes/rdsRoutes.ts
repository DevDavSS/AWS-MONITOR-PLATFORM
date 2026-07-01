import { Router } from "express";
import { getDatabaseById, getDatabases } from "../controllers/rdsController";

const router = Router();

router.get("/", getDatabases);
router.get("/:id", getDatabaseById)

export default router;