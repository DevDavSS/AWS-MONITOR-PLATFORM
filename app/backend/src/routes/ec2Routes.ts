import { Router } from "express";
import { getInstances, getInstanceById } from "../controllers/ec2Controller";

const router = Router();

router.get("/", getInstances);
router.get("/:id", getInstanceById)

export default router;