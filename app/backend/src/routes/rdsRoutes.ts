import { Router } from "express";
import { getDatabaseById, getAuroraRdsInstances } from "../controllers/rdsController";

const router = Router();

router.get("/", getAuroraRdsInstances);
router.get("/:id", getDatabaseById)

export default router;