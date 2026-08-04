
import type { ResourceSnapshot } from "../types/ResourceSnapshot";


export const getResourceSnapshots = async (): Promise<ResourceSnapshot[]> => {

    const response = await fetch(
        `${process.env.SNAPSHOT_API_URL}/resources/snapshots`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve resource snapshots."
        );
    }

    return await response.json();

};