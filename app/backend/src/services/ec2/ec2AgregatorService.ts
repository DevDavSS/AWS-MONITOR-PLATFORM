import { 
    createCloudWatchClient, 
    createEc2Client, 
} from "../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts, getAccountsById } from "../organizations/organizationService";

import { 
    getEc2InstancesAws ,
    getEc2InstanceById
} from "./ec2Service";

import { Ec2Context } from "../../types/awsConstext";

export const getEc2InstancesFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    let accounts;

    if (accountId && accountId !== "all") {
        const account = await getAccountsById(
            organizationId,
            accountId
        );

        if (!account) {
            return [];
        }

        accounts = [account];
    } else {
        accounts = await getAccounts(organizationId);
    }

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

                ec2Client: createEc2Client(credentials, region),

                cloudWatchClient: createCloudWatchClient(credentials, region),

            };

            return await getEc2InstancesAws(
                ec2Context
            );
        })

    );
    return instances.flat();
};

export const getEc2InstanceFromOrganizationById = async (
    organizationId: string,
    region: string,
    instanceId: string,
    accountId?: string
) => {
    let accounts;

    if (accountId && accountId !== "all") {
        const account = await getAccountsById(
            organizationId,
            accountId
        );

        if (!account) {
            return [];
        }

        accounts = [account];
    } else {
        accounts = await getAccounts(organizationId);
    }

    for (const account of accounts) {

        const credentials =
            await getAccountCredentials(organizationId,account.id );

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

        const instance =
            await getEc2InstanceById(
                instanceId,
                ec2Context
            );

        if (instance) {
            return instance;
        }

    }

    return undefined;

};