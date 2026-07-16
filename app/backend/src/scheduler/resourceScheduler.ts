import { refreshResources } from "../services/resourceRefresh/resourceRefreshService";

const REFRESH_INTERVAL = 2 * 60 * 1000;

export const startResourceScheduler = () => {

    console.log("Starting Resource Scheduler...");

    refreshResources().catch(console.error);

    setInterval(() => {

        refreshResources().catch(console.error);

    }, REFRESH_INTERVAL);

};