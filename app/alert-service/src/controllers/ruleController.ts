import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { getOrganizationAccounts } from "../services/organizationService";
import { getAlertRules,createAlertRule, updateAlertRule } from "../services/ruleService";

export const getRules = async (
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

        ...(req.query.enabled !== undefined && {
            enabled:
                typeof req.query.enabled === "string"
                    ? req.query.enabled.toLowerCase() === "true"
                    : Boolean(req.query.enabled)
        })

    };

    const rules = await getAlertRules(filters);


    res.json(rules);

};

export const createRule = async (
    req: Request,
    res: Response
) => {

    console.log("BODY:", req.body);
    const {
        accountIds,
        resourceIds,
        ...ruleData
    } = req.body;

    if (
        !Array.isArray(accountIds) ||
        accountIds.length === 0
    ) {
        return res.status(400).json({
            message: "At least one accountId is required"
        });
    }

    const createdRules = [];

    for (const accountId of accountIds) {

        const rule = {

            id: randomUUID(),

            enabled: true,

            createdAt: new Date(),

            ...ruleData,

            accountId

        };
        await createAlertRule(
            rule,
            resourceIds
        );


        createdRules.push({
            ...rule,
            resourceIds
        });

    }

    res.status(201).json(createdRules);
};


export const updateRule = async (
    req: Request,
    res: Response
) => {

    const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

    if (!id) {
        return res.status(400).json({ message: "Missing rule id" });
    }

    console.log("Updating rule:", id);
    console.log("BODY:", req.body);

    await updateAlertRule(
        id,
        req.body
    );

    res.sendStatus(204);

};
