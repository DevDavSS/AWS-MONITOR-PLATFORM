interface Alert {

    id: string;

    ruleId: string;

    organizationId: string;

    accountId: string;
    
    service: AlertService;

    resourceType: ResourceType;

    resourceId: string;

    resourceName: string;

    metric: string;

    operator: AlertOperator;

    currentValue: number;

    threshold: number;

    createdAt: Date;

}

type AlertService =
    | "ec2"
    | "eks"
    | "rds"
    | "meraki";

type ResourceType =
    | "instance"
    | "database"
    | "cluster"
    | "nodegroup"
    | "node"
    | "device";

type AlertOperator =
    | ">"
    | ">="
    | "<"
    | "<="
    | "="
    | "!=";