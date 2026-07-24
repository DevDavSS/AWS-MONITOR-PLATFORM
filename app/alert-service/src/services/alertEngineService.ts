import { loadResourceSnapshots } from "./resourceSnapshotService";
import { getAlertRules } from "./ruleService";
import { resolveRuntimeRules } from "../engine/runtimeRuleResolver";
import { evaluateAlerts } from "../engine/alertEvaluator";
import { getAlerts, createAlert, resolveAlert } from "../repositories/alertRepository";
import { Alert } from "../types/Alert";
import { buildAlertKey } from "../utils/AlertKey";

export const runAlertEngine = async () => {

    const startedAt = new Date();

    console.log("========================================================");
    console.log(`[${startedAt.toISOString()}] Alert Engine execution started.`);
    console.log("========================================================");

    // Load monitoring data fron backend
    console.log(`[${new Date().toISOString()}] Loading Resource Snapshots...`);
    const snapshots =
        await loadResourceSnapshots();

    console.log(
        `[${new Date().toISOString()}] Resource Snapshots Loaded: ${snapshots.length}`
    );

    // Load configured alert rules
    console.log(`[${new Date().toISOString()}] Loading Alert Rules...`);
    const rules =
        await getAlertRules({
            enabled: true
        }); 

    console.log(
        `[${new Date().toISOString()}] Alert Rules Loaded: ${rules.length}`
    );

    // Resolve rules against current resources
    console.log(`[${new Date().toISOString()}] Resolving Runtime Rules...`);
    const runtimeRules =
        resolveRuntimeRules(
            snapshots,
            rules
        );

    console.log(
        `[${new Date().toISOString()}] Runtime Rules Generated: ${runtimeRules.length}`
    );

    // Evaluate alert conditions
    console.log(`[${new Date().toISOString()}] Evaluating Alerts...`);
    const alerts =
        evaluateAlerts(
            runtimeRules
        );

    console.log(
        `[${new Date().toISOString()}] Alerts Evaluated: ${alerts.length}`
    );

    // Load active alerts from database
    console.log(`[${new Date().toISOString()}] Obtaining Active Alerts...`);
    const activeAlerts =
        await getAlerts({
            state: "ACTIVE",
        });

    console.log(
        `[${new Date().toISOString()}] Active Alerts Loaded: ${activeAlerts.length}`
    );

    const activeAlertMap =
        new Map<string, Alert>();

    for (const alert of activeAlerts) {
        activeAlertMap.set(
            buildAlertKey(alert.ruleId, alert.resourceId),
            alert
        );
    }

    // Detect new alerts
    console.log(`[${new Date().toISOString()}] Filtering Duplicated Alerts...`);

    const newAlerts: Alert[] = [];
    const currentAlertMap = new Map<string, Alert>();

    for (const alert of alerts) {

        const key =
            buildAlertKey(alert.ruleId, alert.resourceId);

        currentAlertMap.set(key, alert);

        if (!activeAlertMap.has(key)) {

            newAlerts.push(alert);

        }
    }

    console.log(
        `[${new Date().toISOString()}] New Alerts Detected: ${newAlerts.length}`
    );

    // Resolve alerts that are no longer active
    console.log(`[${new Date().toISOString()}] Trying to Resolve Active Alerts...`);

    let resolved = 0;

    for (const activeAlert of activeAlerts) {

        const key = buildAlertKey(
            activeAlert.ruleId,
            activeAlert.resourceId
        );

        if (currentAlertMap.has(key)) {
            continue;
        }

        await resolveAlert(activeAlert.id);
        resolved++;

    }

    console.log(
        `[${new Date().toISOString()}] Total Resolved: ${resolved}`
    );

    // Persist newly generated alerts
    console.log(`[${new Date().toISOString()}] Storing New Alerts to Database...`);

    await Promise.all(

        newAlerts.map(alert =>
            createAlert(alert)
        )

    );

    console.log(
        `[${new Date().toISOString()}] Evaluated Alerts: ${alerts.length}`
    );

    console.log(
        `[${new Date().toISOString()}] New Alerts Stored: ${newAlerts.length}`
    );

    console.log(
        `[${new Date().toISOString()}] Alert Engine execution completed in ${Date.now() - startedAt.getTime()} ms.`
    );

    console.log(newAlerts);
}