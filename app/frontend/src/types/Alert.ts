export interface Alert {

    id: string;

    ruleId: string;

    organizationId: string;

    accountId: string;

    region: string;
    
    service: AlertService;

    resourceType: AlertResourceType;

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

export type AlertService = "ec2" | "eks" | "rds";


export type AlertResourceType =
    | "instance"
    | "database"
    | "cluster"
    | "nodegroup"
    | "node"
    | "device";

export interface RuleFormData {
    resourceType: AlertResourceType;
    metric: AlertMetric;
    operator: AlertOperator;
    threshold: number;
    enabled: boolean;
    resourceIds: string[];
}

export type Ec2Metric =
    | "cpu"
    | "memory"
    | "disk"
    | "network";


export type RdsMetric =
    | "cpu"
    | "memory"
    | "connections"
    | "networkIn"
    | "networkOut"
    | "readIops"
    | "writeIops"
    | "readThroughput"
    | "writeThroughput"
    | "readLatency"
    | "writeLatency"
    | "commitThroughput"
    | "selectThroughput";


export type EksMetric =
    | "cpu"
    | "memory"
    | "disk"
    | "network";

export type AlertMetric =
    Ec2Metric |
    RdsMetric |
    EksMetric;


export type AlertOperator =
    | ">"
    | "<"
    | "="
    | ">="
    | "<="
    | "!=";


    export interface CreateRulePayload {

    organizationId: string;

    accountIds: string[];

    region: string;

    service: AlertService;

    resourceType: AlertResourceType;

    resourceIds: string[];

    metric: AlertMetric;

    operator: AlertOperator;

    threshold: number;

}