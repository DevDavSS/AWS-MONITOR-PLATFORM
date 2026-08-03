import { AlertRule } from "../types/AlertRule";
import { ResourceSnapshot } from "../types/ResourceSnapshot";
import { RuntimeRule } from "../types/RuntimeRule";


export const resolveRuntimeRules = (
    snapshots: ResourceSnapshot[],
    rules: AlertRule[]
): RuntimeRule[] => {

    const runtimeRules: RuntimeRule[] = [];

for (const snapshot of snapshots) {

    const applicableRules = rules.filter(rule => {

        return (

            rule.service === snapshot.service
            &&
            rule.resourceType === snapshot.resourceType
            &&
            rule.organizationId === snapshot.organizationId
            &&
            rule.accountId === snapshot.accountId
            &&
            rule.region === snapshot.region
            &&
            rule.resourceIds.includes(
                snapshot.resourceId
            )

        );

    });

    for (const rule of applicableRules) {

        runtimeRules.push({

            rule,

            snapshot

        });
    }

}
    
    return runtimeRules;

};