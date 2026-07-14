import { Router } from "express";
import { getOrganizations } from "../controllers/organizationController";
import { getOrgAccounts } from "../controllers/organizationController";

const router = Router()

router.get("/", getOrganizations)
router.get("/:organizationId/accounts", getOrgAccounts);

export default router;