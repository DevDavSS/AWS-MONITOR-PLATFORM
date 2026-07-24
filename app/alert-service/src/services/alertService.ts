import { 
    getAlerts
} from "../repositories/alertRepository";

import { AlertFilters } from "../types/filters/AlertFilters";
import { Alert } from "../types/Alert";

// Get Alerts optional filters pending
export const getDbAlerts = async(
    filters: AlertFilters = {}
): Promise<Alert[]>=> {
    return await getAlerts(filters);
}

