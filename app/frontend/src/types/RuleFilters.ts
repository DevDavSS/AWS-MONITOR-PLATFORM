import type { AlertService } from "./Alert";
import type { AlertResourceType } from "./Alert";

export interface RuleFilters {

    service?: AlertService;

    organizationId?: string;

    accountId?: string;

    region?: string;

    resourceId?: string;

    resourceType?: AlertResourceType;

    enabled?: boolean;

}