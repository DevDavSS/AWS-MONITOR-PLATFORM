import { db } from "../config/database";
import { Alert } from "../types/Alert";
import { AlertRule } from "../types/AlertRule";
import { AlertRuleFilters } from "../types/filters/RuleFilters";

//Function accepts optional multiple parameters for query filters
export const getRules = async (
    filters: AlertRuleFilters = {}
): Promise<AlertRule[]> => {

    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.service !== undefined) {
        values.push(filters.service);
        conditions.push(`service = $${values.length}`);
    }

    if (filters.resourceId !== undefined) {
        values.push(filters.resourceId);
        conditions.push(`resource_id = $${values.length}`);
    }

    if (filters.organizationId !== undefined) {
        values.push(filters.organizationId);
        conditions.push(`organization_id = $${values.length}`);
    }

    if (filters.accountId !== undefined) {
        values.push(filters.accountId);
        conditions.push(`account_id = $${values.length}`);
    }

    if (filters.region !== undefined) {
        values.push(filters.region);
        conditions.push(`region = $${values.length}`);
    }

    if (filters.enabled !== undefined) {
        values.push(filters.enabled);
        conditions.push(`enabled = $${values.length}`);
    }

    const where =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const result = await db.query(
        `
        SELECT *
        FROM alert_rules
        ${where}
        `,
        values
    );

    return result.rows.map(row => ({

        id: row.id,

        organizationId: row.organization_id,

        accountId: row.account_id,

        region: row.region,

        service: row.service,

        resourceType: row.resource_type,

        resourceId: row.resource_id,

        metric: row.metric,

        operator: row.operator,

        threshold: row.threshold,

        enabled: row.enabled,

        createdAt: row.created_at

    }));

};


export const createRule = async (
    rule: AlertRule
): Promise<void> => {

    await db.query(
        `
        INSERT INTO alert_rules (

            id,

            organization_id,

            account_id,

            region,

            service,

            resource_type,

            resource_id,

            metric,

            operator,

            threshold,

            enabled

        )
        VALUES (

            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11

        )
        `,
        [

            rule.id,

            rule.organizationId,

            rule.accountId,

            rule.region,

            rule.service,

            rule.resourceType,

            rule.resourceId,

            rule.metric,

            rule.operator,

            rule.threshold,

            rule.enabled

        ]
    );

};



export const updateRule = async (
    ruleId: string,
    rule: AlertRule,
): Promise<void> => {

    await db.query(
        `
        UPDATE alert_rules
        SET

            threshold = $1,

            operator = $2,

            metric = $3,

            enabled = $4

        WHERE id = $5
        `,
        [

            rule.threshold,

            rule.operator,

            rule.metric,

            rule.enabled,

            ruleId

        ]
    );

};


// export const findDuplicatedRule = async (
//     rule: AlertRule
// ):Promise<AlertRule[]> => {


// }

export const deleteRule = async(
    ruleId: string,
) => {

    
}