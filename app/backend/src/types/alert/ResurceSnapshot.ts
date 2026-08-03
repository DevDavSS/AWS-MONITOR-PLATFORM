

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

export type AlertService =
    | "ec2"
    | "eks"
    | "rds"
    | "meraki";

export type ResourceType =
    | "instance"
    | "database"
    | "cluster"
    | "nodegroup"
    | "node"
    | "device";

export type AlertOperator =
    | ">"
    | ">="
    | "<"
    | "<="
    | "="
    | "!=";