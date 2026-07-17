import { 
    createCloudWatchClient, 
    createRdsClient
} from "../../../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts } from "../organizations/organizationService";
import { getCache,setCache } from "../../../../cache/resourceCache";
import type { RdsDatabase } from "../../../../types/services/rds";

import { 
    getAuroraRDSAws, 
} from "./rdsService";

import { RdsContext } from "../../../../types/services/awsConstext";

export const refreshRdsOrganizationCache = async (
    organizationId: string,
    region: string
) => {
    const start = Date.now();

    try{
        const cacheKey =
            `rds:${organizationId}:${region}`;

        const accounts =
            await getAccounts(
                organizationId
            );

        const auroraRdsInstances = await Promise.all(

            accounts.map(async account => {
                const credentials = 
                    await getAccountCredentials(
                        organizationId,
                        account.id,
                        region
                    );

                const RdsContext: RdsContext = {

                    organizationId,

                    accountId: account.id,

                    accountName: account.name,

                    region,

                    rdsClient: createRdsClient(credentials, region),

                    cloudWatchClient: createCloudWatchClient(credentials, region)

                };
                return await getAuroraRDSAws(
                    RdsContext
                );
            })
        )
        const allDatabases =
            auroraRdsInstances.flat();

        setCache(
            cacheKey,
            allDatabases
        );
           const elapsed = Date.now() - start;

        console.log(
            `[RDS] ${organizationId} | ${region} | ${allDatabases.length} instances | ${elapsed} ms`
        );

        return allDatabases;
    }catch (error) {

        const elapsed = Date.now() - start;

        console.error(
            `[RDS] ${organizationId} | ${region} | ERROR | ${elapsed} ms`,
            error
        );
        throw error;
    }

}

export const getAuroraRdsFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    const cacheKey =
        `rds:${organizationId}:${region}`;

    let databases = 
        getCache<RdsDatabase[]>(cacheKey);


    if (!databases) {

        console.log("RDS CACHE MISS");

        databases =
            await refreshRdsOrganizationCache(
                organizationId,
                region
            ) as RdsDatabase[];

    } else {

        console.log("RDS CACHE HIT");

    }

    if (accountId && accountId !== "all") {

        return databases.filter(
            database =>
                database.account === accountId
        );

    }

    return databases;
};

export const getAuroraRdsFromOrganizationById = async (
    organizationId: string,
    region: string,
    auroraRdsInstanceId: string,
    accountId?: string
) => {
    const instances =
        await getAuroraRdsFromOrganization(
            organizationId,
            region,
            accountId
        );

    return instances.find(
        instance =>
            instance.id === auroraRdsInstanceId
    );
};