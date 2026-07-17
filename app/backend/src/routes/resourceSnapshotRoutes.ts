import { Router } from "express";
import { getResourceSnapshots } from "../controllers/resourceSnapshotController";

const router = Router();

router.get(
    "/",
    getResourceSnapshots
);

export default router;