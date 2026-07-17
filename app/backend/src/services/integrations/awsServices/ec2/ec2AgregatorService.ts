import { 
    createCloudWatchClient, 
    createEc2Client, 
} from "../../../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts } from "../organizations/organizationService";
import { getCache,setCache } from "../../../../cache/resourceCache";

import { 
    getEc2InstancesAws ,
} from "./ec2Service";

import { Ec2Context } from "../../../../types/services/awsConstext";
import { EC2Instance } from "../../../../types/services/ec2";

/* Funcion encargada de recuperar o crear cache de los recursos */
export const refreshEc2OrganizationCache = async (
    organizationId: string,
    region: string
) => {
    const start = Date.now();

    try{
        const cacheKey =
            `ec2:${organizationId}:${region}`;

        const accounts =
            await getAccounts(
                organizationId
            );

        const instances = await Promise.all(

            accounts.map(async account => {

                const credentials =
                    await getAccountCredentials(
                        organizationId,
                        account.id,
                        region
                    );

                const ec2Context: Ec2Context = {

                    organizationId,

                    accountId: account.id,

                    accountName: account.name,

                    region,

                    ec2Client:
                        createEc2Client(
                            credentials,
                            region
                        ),

                    cloudWatchClient:
                        createCloudWatchClient(
                            credentials,
                            region
                        ),

                };

                return await getEc2InstancesAws(
                    ec2Context
                );

            })

        );
        const allInstances =
            instances.flat();

        setCache(
            cacheKey,
            allInstances
        );
        const elapsed = Date.now() - start;

        console.log(
            `[EC2] ${organizationId} | ${region} | ${allInstances.length} instances | ${elapsed} ms`
        );

        return allInstances;

    }catch (error) {

        const elapsed = Date.now() - start;

        console.error(
            `[EC2] ${organizationId} | ${region} | ERROR | ${elapsed} ms`,
            error
        );
        throw error;
    }
};


export const getEc2InstancesFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    const cacheKey =
        `ec2:${organizationId}:${region}`;

    let instances =
        getCache<EC2Instance[]>(cacheKey);

    if (!instances) {

        console.log("EC2 CACHE MISS");

        instances =
            await refreshEc2OrganizationCache(
                organizationId,
                region
            );

    } else {

        console.log("EC2 CACHE HIT");

    }

    if (accountId && accountId !== "all") {

        return instances.filter(
            instance =>
                instance.accountId === accountId
        );

    }

    return instances;

};

export const getEc2InstanceFromOrganizationById = async (
    organizationId: string,
    region: string,
    instanceId: string,
    accountId?: string
) => {

    const instances =
        await getEc2InstancesFromOrganization(
            organizationId,
            region,
            accountId
        );

    return instances.find(
        instance =>
            instance.id === instanceId
    );

};