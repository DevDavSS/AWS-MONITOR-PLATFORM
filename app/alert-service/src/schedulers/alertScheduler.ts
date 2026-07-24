import { runAlertEngine } from "../services/alertEngineService";

const ALERT_INTERVAL = 60 * 1000;

export const startAlertScheduler = () => {

    console.log("Starting Alert Scheduler...");

    runAlertEngine();

    setInterval(async () => {

        try {

            await runAlertEngine();

        } catch (error) {

            console.error(
                "Alert Engine failed:",
                error
            );

        }

    }, ALERT_INTERVAL);

};