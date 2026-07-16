export interface ResourceSnapshot {

    organizationId: string;

    accountId: string;    
    
    service: AlertService

    resourceType: ResourceType

    resourceId: string;

    resourceName: string;

    metricas: Record<string, number>; 
}