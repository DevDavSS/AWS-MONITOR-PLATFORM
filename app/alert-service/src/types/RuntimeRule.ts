import { AlertRule } from "./AlertRule";
import { ResourceSnapshot } from "./ResourceSnapshot";

export interface RuntimeRule {

    rule: AlertRule;

    snapshot: ResourceSnapshot;

}