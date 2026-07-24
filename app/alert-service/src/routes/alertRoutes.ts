import { Router } from "express";
import { getAlerts } from "../controllers/alertController";

const router = Router();

router.get(
    "/",
    getAlerts
);

export default router;