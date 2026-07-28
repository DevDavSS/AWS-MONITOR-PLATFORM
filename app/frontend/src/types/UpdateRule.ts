import type { AlertMetric, AlertOperator } from "./Alert";


export interface UpdateRuleRequest {

    metric: AlertMetric;

    operator: AlertOperator;

    threshold: number;

    enabled: boolean;

    resourceIds: string[];

}