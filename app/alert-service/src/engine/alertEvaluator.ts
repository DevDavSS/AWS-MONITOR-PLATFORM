import { Alert } from "../types/Alert";
import { RuntimeRule } from "../types/RuntimeRule";
import { randomUUID } from "crypto";

export const evaluateAlerts = (
    runtimeRules: RuntimeRule[]
): Alert[] => {

    const alerts: Alert[] = [];

    for (const runtimeRule of runtimeRules) {

        const { rule, snapshot } = runtimeRule;

        const metricValue =
            snapshot.metricas[rule.metric];

        if (metricValue === undefined) {
            continue;
        }

        if (!evaluateCondition(
            metricValue,
            rule.operator,
            rule.threshold
        )) {
            continue;
        }

        alerts.push({

            id: randomUUID(),

            ruleId: rule.id,

            organizationId: snapshot.organizationId,

            accountId: snapshot.accountId,

            region: snapshot.region,

            service: snapshot.service,

            resourceType: snapshot.resourceType,

            resourceId: snapshot.resourceId,

            resourceName: snapshot.resourceName,

            metric: rule.metric,

            operator: rule.operator,

            currentValue: metricValue,

            threshold: rule.threshold,

            state: "ACTIVE",

            createdAt: new Date()

        });

    }

    return alerts;

};


const evaluateCondition = (
    value: number,
    operator: string,
    threshold: number
): boolean => {

    switch (operator) {

        case ">":
            return value > threshold;

        case ">=":
            return value >= threshold;

        case "<":
            return value < threshold;

        case "<=":
            return value <= threshold;

        case "==":
            return value === threshold;

        default:
            return false;

    }

};