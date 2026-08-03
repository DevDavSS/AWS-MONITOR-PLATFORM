import { AlertOperator, AlertService, ResourceType } from "./ResurceSnapshot";

export interface AlertRule {

    id: string;

    organizationId: string;

    accountId: string;

    service: AlertService;

    resourceType: ResourceType;

    resourceId: string;

    metric: string;

    operator: AlertOperator;

    threshold: number;

    createdAt: string;

    enabled: boolean;

}