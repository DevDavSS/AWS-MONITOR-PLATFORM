export interface Alert {

    id: string;

    ruleId: string;

    organizationId: string;

    accountId: string;

    region: string;
    
    service: AlertService;

    resourceType: ResourceType;

    resourceId: string;

    resourceName: string;

    metric: string;

    operator: AlertOperator;

    currentValue: number;

    threshold: number;

    state: string;

    createdAt: Date;

    resolvedAt?: Date;

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

