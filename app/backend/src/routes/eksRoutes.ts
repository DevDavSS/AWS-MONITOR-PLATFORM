import { Router } from "express";
import { getClusters, getClusterById, getNodeGroupById } from "../controllers/eksConstroller";


const router = Router();

router.get("/", getClusters);
router.get("/:clusterId", getClusterById)
router.get("/:clusterId/nodegroups/:nodeGroupId",getNodeGroupById)

export default router;