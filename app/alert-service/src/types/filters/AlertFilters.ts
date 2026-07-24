export interface AlertFilters {

    service?: string;

    organizationId?: string;

    accountId?: string;

    region?: string;

    resourceId?: string;

    state?: "ACTIVE" | "RESOLVED";

}