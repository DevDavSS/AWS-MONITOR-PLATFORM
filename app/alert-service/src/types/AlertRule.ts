import type { AlertService, ResourceType, AlertOperator } from "./Alert"

export interface AlertRule {

    id: string;   //auto (alert microservice managed)

    organizationId: string; //auto (frontend managed)

    accountId: string;  //auto (frontend managed)

    region: string; //auto (frontend managed)

    service: AlertService; //auto (frontend managed)

    resourceType: ResourceType; //auto (frontend managed)

    resourceId: string;   //auto (frontend managed)

    metric: string;  //manual

    operator: AlertOperator; //manual

    threshold: number;  //manual

    createdAt: string; //auto (alert microservice managed)

    enabled: boolean; // auto (alert microservice managed Once Created)

}