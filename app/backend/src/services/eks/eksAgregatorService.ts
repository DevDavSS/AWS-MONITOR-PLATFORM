import { 
    createCloudWatchClient, 
    createEksClient, 
    createEc2Client,
    createAutoScalingClient,
} from "../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts } from "../organizations/organizationService";
import { getCache, setCache } from "../../cache/resourceCache";
import { 
    getEksClusters 
} from "./eksService";

import { EksContext } from "../../types/awsConstext";
import { EksCluster } from "../../types/eks";

export const getEksClustersFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    const cacheKey =
        `eks:${organizationId}:${region}`;

    const cached =
        getCache<EksCluster[]>(cacheKey);

    if (cached) {

        console.log("EKS CACHE HIT");

        if (accountId && accountId !== "all") {
            return cached.filter(
                cluster =>
                    cluster.accountId === accountId
            );

        }

        return cached;

    }

    console.log("EKS CACHE MISS");

    const accounts =
        await getAccounts(
            organizationId
        );

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
    const allClusters =
        clusters.flat();

    setCache(
        cacheKey,
        allClusters
    );

    if (accountId && accountId !== "all") {

        return allClusters.filter(
            cluster =>
                cluster.accountId === accountId
        );

    }

    return allClusters;
};  


export const getEksClusterByIdFromOrganization = async (
    organizationId: string,
    region: string,
    clusterId: string,
    accountId?: string
) => {

    const clusters =
        await getEksClustersFromOrganization(
            organizationId,
            region,
            accountId
        );

    return clusters.find(
        cluster =>
            cluster.id === clusterId
    );

};


export const getEksNodeGroupByIdFromOrganization = async (
    organizationId: string,
    region: string,
    clusterId: string,
    nodeGroupId: string,
    accountId?: string
) => {

    const cluster =
        await getEksClusterByIdFromOrganization(
            organizationId,
            region,
            clusterId,
            accountId
        );

    return cluster?.nodeGroups.find(
        nodeGroup =>
            nodeGroup.name === nodeGroupId
    );
};



export const getEksNodeByIdFromOrganization = async (
    organizationId: string,
    region: string,
    clusterId: string,
    nodeGroupId: string,
    nodeId: string,
    accountId?: string

) => {

    const nodeGroup =
        await getEksNodeGroupByIdFromOrganization(
            organizationId,
            region,
            clusterId,
            nodeGroupId,
            accountId
        );

    return nodeGroup?.nodes.find(
        node =>
            node.id === nodeId
    );
};
