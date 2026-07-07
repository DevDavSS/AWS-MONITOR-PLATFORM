import { Router } from "express";
import { getClusters, getClusterById, getNodeGroupById, getNodeById } from "../controllers/eksConstroller";


const router = Router();

router.get("/", getClusters);
router.get("/:clusterId", getClusterById)
router.get("/:clusterId/nodegroups/:nodeGroupId",getNodeGroupById)
router.get("/:clusterId/nodegroups/:nodeGroupId/node/:nodeId",getNodeById)

export default router;