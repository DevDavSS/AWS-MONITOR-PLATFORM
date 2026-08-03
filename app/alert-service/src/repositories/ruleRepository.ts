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

        conditions.push(
            `ar.service = $${values.length}`
        );

    }
    if (filters.resourceId !== undefined) {

        values.push(filters.resourceId);

        conditions.push(
            `
            EXISTS (
                SELECT 1
                FROM rule_resources rr
                WHERE rr.rule_id = ar.id
                AND rr.resource_id = $${values.length}
            )
            `
        );
    }

    if (filters.organizationId !== undefined) {

        values.push(filters.organizationId);

        conditions.push(
            `ar.organization_id = $${values.length}`
        );

    }

    if (filters.accountId !== undefined) {

        values.push(filters.accountId);

        conditions.push(
            `ar.account_id = $${values.length}`
        );

    }

    if (filters.region !== undefined) {

        values.push(filters.region);

        conditions.push(
            `ar.region = $${values.length}`
        );

    }

    if (filters.enabled !== undefined) {

        values.push(filters.enabled);

        conditions.push(
            `ar.enabled = $${values.length}`
        );

    }

    const where =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const result = await db.query(
        `
        SELECT

            ar.*,

            ARRAY_AGG(rr.resource_id)
            FILTER (
                WHERE rr.resource_id IS NOT NULL
            ) AS resource_ids

        FROM alert_rules ar

        LEFT JOIN rule_resources rr

        ON rr.rule_id = ar.id

        ${where}

        GROUP BY ar.id

        `,
        values
    );



    return result.rows.map(row => ({


        id: row.id,

        organizationId:
            row.organization_id,

        accountId:
            row.account_id,

        region:
            row.region,

        service:
            row.service,

        resourceType:
            row.resource_type,

        resourceIds:
            row.resource_ids ?? [],

        metric:
            row.metric,

        operator:
            row.operator,

        threshold:
            row.threshold,

        enabled:
            row.enabled,

        createdAt:
            row.created_at
    }));

};


export const createRuleWithResources = async (
    rule: AlertRule,
    resourceIds: string[]
): Promise<void> => {
    const client = await db.connect();

    try {
        await client.query("BEGIN");
        // 1. Crear regla principal

        await client.query(
            `
            INSERT INTO alert_rules (

                id,
                organization_id,
                account_id,
                region,
                service,
                resource_type,
                metric,
                operator,
                threshold,
                enabled

            )
            VALUES (

                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10

            )
            `,
            [

                rule.id,

                rule.organizationId,

                rule.accountId,

                rule.region,

                rule.service,

                rule.resourceType,

                rule.metric,

                rule.operator,

                rule.threshold,

                rule.enabled

            ]
        );

        // 2. Insertar recursos relacionados
        if(resourceIds.length > 0){


            const values:string[] = [];
            const params:any[] = [];

            resourceIds.forEach((resourceId,index)=>{

                const position = index * 2;
                values.push(
                    `($${position + 1},$${position + 2})`
                );


                params.push(
                    rule.id,
                    resourceId
                );

            });

            await client.query(
                `
                INSERT INTO rule_resources (

                    rule_id,
                    resource_id

                )
                VALUES

                ${values.join(",")}

                `,
                params
            );

        }

        await client.query("COMMIT");

    } catch(error){


        await client.query("ROLLBACK");

        throw error;


    } finally {

        client.release();

    }

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