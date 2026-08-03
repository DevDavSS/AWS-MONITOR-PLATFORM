import { AlertRule } from "../types/AlertRule";
import { getRules, createRuleWithResources, updateRule } from "../repositories/ruleRepository";
import { AlertRuleFilters } from "../types/filters/RuleFilters";

// Get Rules, optional filters
export const getAlertRules = async (
    filters: AlertRuleFilters = {}
): Promise<AlertRule[]> => {
    return await getRules(filters);

};

export const createAlertRule = async (
    rule: AlertRule,
    resourceIds: string[]
) => {

    await createRuleWithResources(
        rule,
        resourceIds
    );

};


export const updateAlertRule = async (
    ruleId: string,
    rule: AlertRule
) => {

    await updateRule(ruleId, rule);

};

export const deleteAlertRule = async () => {

};