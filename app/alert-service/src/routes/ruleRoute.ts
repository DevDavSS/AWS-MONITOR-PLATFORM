import { Router } from "express";
import { getRules, createRule, updateRule } from "../controllers/ruleController";



const router = Router();

router.get(
    "/",
    getRules
);

router.post(
    "/",
    createRule
);

router.put(
    "/:id",
    updateRule
);

export default router;