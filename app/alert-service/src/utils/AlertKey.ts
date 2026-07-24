export const buildAlertKey = (
    ruleId: string,
    resourceId: string
) => `${ruleId}:${resourceId}`;