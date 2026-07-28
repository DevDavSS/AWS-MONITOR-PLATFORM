import type { AlertFilters } from "@/types/AlertFilters";


export const getAlerts = async (

    filters: AlertFilters

) => {

    const params = new URLSearchParams();

    if(filters.service)
        params.append("service", filters.service);

    if(filters.organizationId)
        params.append("organizationId", filters.organizationId);

    if(filters.accountId)
        params.append("accountId", filters.accountId);

    if(filters.region)
        params.append("region", filters.region);

    if(filters.resourceId)
        params.append("resourceId", filters.resourceId);

    if(filters.state)
        params.append("state", filters.state);

    const response = await fetch(

        `http://localhost:3001/api/alerts?${params}`

    );

    return response.json();

}