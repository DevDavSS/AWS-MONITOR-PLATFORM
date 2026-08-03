import type { AlertFilters } from "@/types/AlertFilters";


const ALERT_API_URL = import.meta.env.VITE_ALERT_SERVICE_API;

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

        `${ALERT_API_URL}/alerts?${params}`

    );

    return response.json();

}