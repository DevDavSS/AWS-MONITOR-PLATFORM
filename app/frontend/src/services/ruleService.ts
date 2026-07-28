import type { RuleFilters } from "@/types/RuleFilters";
import type { CreateRulePayload } from "@/types/Alert";
import type { UpdateRuleRequest } from "@/types/UpdateRule";


export const getRules = async (

    filters: RuleFilters

) => {

    const params = new URLSearchParams();

    if(filters.service)
        params.append("service", filters.service);

    if(filters.organizationId)
        params.append("organizationId", filters.organizationId);

    if(filters.accountId && filters.accountId !== "all")
        params.append("accountId", filters.accountId);

    if(filters.region)
        params.append("region", filters.region);

    if(filters.resourceId)
        params.append("resourceId", filters.resourceId);
    
    if(filters.resourceType)
        params.append("resourceType", filters.resourceType);

    if(filters.enabled !== undefined)
        params.append("enabled", String(filters.enabled));


    const response = await fetch(

        `http://localhost:3001/api/rules?${params.toString()}`

    );

    return response.json();

};


export const createRule = async (

    rule: CreateRulePayload

) => {

    const response = await fetch(

        "http://localhost:3001/api/rules",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(rule)

        }

    );


    if (!response.ok) {

        throw new Error("Failed to create rule");

    }


    return response.json();

};

export const updateRule = async (
    ruleId: string,
    rule: UpdateRuleRequest,
) => {

    const response = await fetch(

        `http://localhost:3001/api/rules/${ruleId}`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(rule)

        }

    );

    if (!response.ok) {

        throw new Error("Failed to update rule");

    }

};