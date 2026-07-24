import { AlertRule } from "../types/AlertRule";
import { getRules, createRule, updateRule } from "../repositories/ruleRepository";
import { AlertRuleFilters } from "../types/filters/RuleFilters";

// Get Rules, optional filters
export const getAlertRules = async (
    filters: AlertRuleFilters = {}
): Promise<AlertRule[]> => {
    return await getRules(filters)
} 

// Create new Rule (upgrade: deduplicated rules validation)
export const createAlertRule = async (
    rule:AlertRule
) => {
    
    await createRule(rule);

};


export const updateAlertRule = async (
    ruleId: string,
    rule: AlertRule
) => {

    await updateRule(ruleId, rule);

};

export const deleteAlertRule = async () => {

};