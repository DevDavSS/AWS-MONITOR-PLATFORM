import { 
    createCloudWatchClient, 
    createEc2Client, 
} from "../../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts } from "../organizations/organizationService";
import { getCache,setCache } from "../../../cache/resourceCache";

import { 
    getEc2InstancesAws ,
} from "./ec2Service";

import { Ec2Context } from "../../../types/services/awsConstext";
import { EC2Instance } from "../../../types/services/ec2";


export const getEc2InstancesFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    const cacheKey =
        `ec2:${organizationId}:${region}`;

    const cached =
        getCache<EC2Instance[]>(cacheKey);

    if (cached) {

        console.log("EC2 CACHE HIT");

        if (accountId && accountId !== "all") {
            return cached.filter(
                instance =>
                    instance.accountId === accountId
            );

        }

        return cached;

    }

    console.log("EC2 CACHE MISS");

    const accounts =
        await getAccounts(
            organizationId
        );

    const instances = await Promise.all(

        accounts.map(async account => {

            const credentials =
                await getAccountCredentials(
                    organizationId,
                    account.id
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

    if (accountId && accountId !== "all") {

        return allInstances.filter(
            instance =>
                instance.accountId === accountId
        );

    }

    return allInstances;

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