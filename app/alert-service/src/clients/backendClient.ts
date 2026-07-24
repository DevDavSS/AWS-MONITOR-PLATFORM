
import type { ResourceSnapshot } from "../types/ResourceSnapshot";

const BACKEND_URL =
    process.env.BACKEND_URL ??
    "http://localhost:3000";

export const getResourceSnapshots = async (): Promise<ResourceSnapshot[]> => {

    const response = await fetch(
        `${BACKEND_URL}/api/resources/snapshots`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve resource snapshots."
        );
    }

    return await response.json();

};