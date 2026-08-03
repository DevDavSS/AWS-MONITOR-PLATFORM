
export interface CacheStatus {

    lastUpdated: number | null;

    nextUpdate: number | null;

}
const API_URL = import.meta.env.VITE_BACKEND_API;

export const getCacheStatus = async(): Promise<CacheStatus> => {

    const response = await fetch(
        `${API_URL}/cache/status`
    );

    if(!response.ok){
        throw new Error(
            "Error fetching cache status"
        );
    }

    return response.json();

};