interface CacheMetadata {
    lastUpdated: number | null;
    nextUpdate: number | null;
}

const cacheMetadata: CacheMetadata = {
    lastUpdated: null,
    nextUpdate: null
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos para que se reestablezca el cache (No actualiza)

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const resourceCache = new Map<
    string,
    CacheEntry<unknown>
>();

export const getCache = <T>(
    key: string
): T | undefined => {

    const entry =
        resourceCache.get(key);

    if (!entry) {
        return undefined;
    }

    if (Date.now() >= entry.expiresAt) {

        resourceCache.delete(key);

        return undefined;

    }

    return entry.data as T;

};

export const setCache = <T>(
    key: string,
    data: T
) => {

    resourceCache.set(
        key,
        {
            data,
            expiresAt:
                Date.now() + CACHE_TTL,
        }
    );

};

export const clearCache = () => {

    resourceCache.clear();

};

export const getAllCache = () => {
    return resourceCache;
}


export const updateCacheMetadata = () => {

    cacheMetadata.lastUpdated = Date.now();

    cacheMetadata.nextUpdate =
        Date.now() + (2 * 60 * 1000);

};


export const getCacheMetadata = () => {

    return cacheMetadata;

};