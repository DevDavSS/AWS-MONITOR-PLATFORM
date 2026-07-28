import type { AlertService, AlertResourceType, AlertOperator, AlertMetric } from "./Alert"

export interface AlertRule {

    id: string;   //auto (alert microservice managed)

    organizationId: string; //auto (frontend managed)

    accountId: string;  //auto (frontend managed)

    region: string; //auto (frontend managed)

    service: AlertService; //auto (frontend managed)

    resourceType: AlertResourceType; //auto (frontend managed)

    resourceIds: string[];   //auto (frontend managed)

    metric: AlertMetric;  //manual

    operator: AlertOperator; //manual

    threshold: number;  //manual

    createdAt: string; //auto (alert microservice managed)

    enabled: boolean; // auto (alert microservice managed Once Created)

}