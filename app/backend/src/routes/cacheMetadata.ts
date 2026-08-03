import { Router } from "express";
import { cacheMetadata } from "../controllers/cacheMetadataController";

const router = Router();

router.get("/", cacheMetadata);


export default router;