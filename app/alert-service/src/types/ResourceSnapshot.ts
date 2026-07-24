import type { AlertService, ResourceType } from "./Alert"

export interface ResourceSnapshot {

    organizationId: string;

    accountId: string;    

    region: string;
    
    service: AlertService

    resourceType: ResourceType

    resourceId: string;

    resourceName: string;

    metricas: Record<string, number>; 
}