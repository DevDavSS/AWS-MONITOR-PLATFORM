import { Request, Response } from "express";

import { getDbAlerts } from "../services/alertService";

export const getAlerts = async (
    req: Request,
    res: Response
) => {

    const filters = {

        ...(req.query.service && {
            service: req.query.service as string
        }),

        ...(req.query.organizationId && {
            organizationId: req.query.organizationId as string
        }),

        ...(req.query.accountId && {
            accountId: req.query.accountId as string
        }),

        ...(req.query.region && {
            region: req.query.region as string
        }),

        ...(req.query.resourceId && {
            resourceId: req.query.resourceId as string
        }),

        ...(req.query.state && {
            state: req.query.state as "ACTIVE" | "RESOLVED"
        })

    };


    const alerts = await getDbAlerts(filters);

    res.json(alerts);

};