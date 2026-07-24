import { getResourceSnapshots } from "../clients/backendClient";
import { ResourceSnapshot } from "../types/ResourceSnapshot";

export const loadResourceSnapshots = async (): Promise<ResourceSnapshot[]> =>  {

    const snapshots = 
        await getResourceSnapshots();

    return snapshots
}