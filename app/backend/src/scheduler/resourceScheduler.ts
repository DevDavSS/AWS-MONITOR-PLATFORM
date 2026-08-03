import { refreshResources } from "../services/resourceRefresh/resourceRefreshService";
import { updateCacheMetadata } from "../cache/resourceCache";

const REFRESH_INTERVAL = 2 * 60 * 1000;

export const startResourceScheduler = () => {

    console.log("Starting Resource Scheduler...");

    refreshResources()
        .then(() => updateCacheMetadata())
        .catch(console.error);


    setInterval(() => {

        refreshResources()
            .then(() => updateCacheMetadata())
            .catch(console.error);

    }, REFRESH_INTERVAL);

};