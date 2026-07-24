import { db } from "../config/database";
import { Alert } from "../types/Alert";
import { AlertFilters } from "../types/filters/AlertFilters";


export const getAlerts = async (
    filters: AlertFilters = {}
): Promise<Alert[]> => {

    const conditions: string[] = [];
    const values: any[] = [];

    if (filters.service !== undefined) {
        values.push(filters.service);
        conditions.push(`service = $${values.length}`);
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

    if (filters.resourceId !== undefined) {
        values.push(filters.resourceId);
        conditions.push(`resource_id = $${values.length}`);
    }

    if (filters.state !== undefined) {
        values.push(filters.state);
        conditions.push(`state = $${values.length}`);
    }

    const where =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const result = await db.query<Alert>(
        `
        SELECT

            id,

            rule_id          AS "ruleId",

            organization_id  AS "organizationId",

            account_id       AS "accountId",

            region,

            service,

            resource_type    AS "resourceType",

            resource_id      AS "resourceId",

            resource_name    AS "resourceName",

            metric,

            operator,

            threshold,

            current_value    AS "currentValue",

            state,

            created_at       AS "createdAt",

            resolved_at      AS "resolvedAt"

        FROM

            alerts

        ${where}

        ORDER BY created_at DESC;
        `,
        values
    );

    return result.rows;
};




export const createAlert = async (
    alert: Alert
): Promise<void> => {

    await db.query(

        `
        INSERT INTO alerts (

            id,

            rule_id,

            organization_id,

            account_id,

            region,

            service,

            resource_type,

            resource_id,

            resource_name,

            metric,

            operator,

            threshold,

            current_value,

            state,

            created_at

        )

        VALUES (

            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15

        )
        `,

        [

            alert.id,

            alert.ruleId,

            alert.organizationId,

            alert.accountId,

            alert.region,

            alert.service,

            alert.resourceType,

            alert.resourceId,

            alert.resourceName,

            alert.metric,

            alert.operator,

            alert.threshold,

            alert.currentValue,

            alert.state,

            alert.createdAt

        ]

    );

};





export const resolveAlert = async (
    alertId: string,
) => {
    await db.query(

        `
        UPDATE alerts
        SET

        state= 'RESOLVED',

        resolved_at = NOW()

        WHERE id=$1;
        `,
        [
            alertId,
        ]);
}