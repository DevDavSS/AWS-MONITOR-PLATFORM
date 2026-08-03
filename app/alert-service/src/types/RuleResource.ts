import { AlertRule } from "./AlertRule";

export interface AlertRuleWithResources extends AlertRule {

    resourceIds: string[];

}