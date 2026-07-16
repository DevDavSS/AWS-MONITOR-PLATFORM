import { 
    createCloudWatchClient, 
    createRdsClient
} from "../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts, getAccountsById } from "../organizations/organizationService";
import { getCache,setCache } from "../../cache/resourceCache";
import type { RdsDatabase } from "../../types/rds";

import { 
    getAuroraRDSAws, 
} from "./rdsService";

import { RdsContext } from "../../types/awsConstext";


export const getAuroraRdsFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    const cacheKey =
        `rds:${organizationId}:${region}`;

    const cached =
        getCache<RdsDatabase[]>(cacheKey);

    if (cached) {

        console.log("RDS CACHE HIT");

        if (accountId && accountId !== "all") {
            return cached.filter(
                instance =>
                    instance.accountId === accountId
            );

        }

        return cached;

    }

    console.log("RDS CACHE MISS");

    const accounts =
        await getAccounts(
            organizationId
        );

    const auroraRdsInstances = await Promise.all(

        accounts.map(async account => {
            const credentials = 
                await getAccountCredentials(
                    organizationId,
                    account.id
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
    const allInstances =
        auroraRdsInstances.flat();

    setCache(
        cacheKey,
        allInstances
    );

    if (accountId && accountId !== "all") {

        return allInstances.filter(
            instance =>
                instance.account === accountId
        );

    }

    return allInstances;
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