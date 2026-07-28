export interface CacheStatus {

    lastUpdated: number | null;

    nextUpdate: number | null;

}


export const getCacheStatus = async(): Promise<CacheStatus> => {

    const response = await fetch(
        "http://localhost:3000/api/cache/status"
    );

    if(!response.ok){
        throw new Error(
            "Error fetching cache status"
        );
    }

    return response.json();

};