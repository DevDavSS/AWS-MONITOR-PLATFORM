import { Router } from "express";
import { getInstances } from "../controllers/ec2Controller";

const router = Router();

router.get("/", getInstances);

export default router;