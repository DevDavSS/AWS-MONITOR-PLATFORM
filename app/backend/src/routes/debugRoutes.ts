// routes/debugRoutes.ts

import { Router } from "express";
import { debugCloudWatch } from "../controllers/debugController";

const router = Router();

router.get("/cwagent", debugCloudWatch);

export default router;