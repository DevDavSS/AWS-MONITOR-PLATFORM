import { 
    createCloudWatchClient, 
    createEksClient, 
    createEc2Client,
    createAutoScalingClient,
} from "../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts, getAccountsById } from "../organizations/organizationService";

import { 
    getEksNodeById,
    getEksNodeGroupById,
    getEksClusterById, 
    getEksClusters 
} from "./eksService";

import { EksContext } from "../../types/awsConstext";

export const getEksClustersFromOrganization = async (
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

    const clusters = await Promise.all(
        accounts.map(async account => {
            const credentials = 
                await getAccountCredentials(
                    organizationId,
                    account.id
                );

            const eksContext: EksContext = {
                organizationId,

                accountId: account.id,

                accountName: account.name,

                region,

                ec2Client: createEc2Client(credentials, region),

                eksClient: createEksClient(credentials, region),

                cloudWatchClient: createCloudWatchClient(credentials, region),

                autoScalingClient: createAutoScalingClient(credentials, region),
            };
            return await getEksClusters(
                eksContext
            );
        })
    );
    return clusters.flat();
};  


export const getEksClustersByIdFromOrganization = async (
    organizationId: string,
    region: string,
    clusterId: string,
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
            await getAccountCredentials(organizationId, account.id)

        const eksContext: EksContext = {

            organizationId,

            accountId: account.id,
            accountName: account.name,

            region, 

            ec2Client: createEc2Client(credentials, region),

            eksClient: createEksClient(credentials, region),

            cloudWatchClient: createCloudWatchClient(credentials, region),

            autoScalingClient: createAutoScalingClient(credentials, region),

        };
        const cluster = 
            await getEksClusterById(
                eksContext,
                clusterId
            )
        
        if (cluster){
            return cluster;
        }
    }
    return undefined
};


export const getEksNodeGroupByIdFromOrganization = async (
    organizationId: string,
    region: string,
    clusterId: string,
    nodeGroupId: string,
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
            await getAccountCredentials(organizationId, account.id)

        const eksContext: EksContext = {

            organizationId,

            accountId: account.id,
            accountName: account.name,

            region, 

            ec2Client: createEc2Client(credentials, region),

            eksClient: createEksClient(credentials, region),

            cloudWatchClient: createCloudWatchClient(credentials, region),

            autoScalingClient: createAutoScalingClient(credentials, region),

        };
        const nodeGroup = 
            await getEksNodeGroupById(
                eksContext,
                clusterId,
                nodeGroupId
            )
        
        if (nodeGroup){
            return nodeGroup;
        }
    }
    return undefined
};



export const getEksNodeByIdFromOrganization = async (
    organizationId: string,
    region: string,
    clusterId: string,
    nodeGroupId: string,
    nodeId: string,
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
            await getAccountCredentials(organizationId, account.id)

        const eksContext: EksContext = {

            organizationId,

            accountId: account.id,
            accountName: account.name,

            region, 

            ec2Client: createEc2Client(credentials, region),

            eksClient: createEksClient(credentials, region),

            cloudWatchClient: createCloudWatchClient(credentials, region),

            autoScalingClient: createAutoScalingClient(credentials, region),

        };
        const node = 
            await getEksNodeById(
                eksContext,
                clusterId,
                nodeGroupId,
                nodeId
            )
        
        if (node){
            return node;
        }
    }
    return undefined
};
