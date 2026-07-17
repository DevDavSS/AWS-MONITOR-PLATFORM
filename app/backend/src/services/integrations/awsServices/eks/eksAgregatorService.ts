import { 
    createCloudWatchClient, 
    createEksClient, 
    createEc2Client,
    createAutoScalingClient,
} from "../../../../aws/clientFactory";

import { getAccountCredentials } from "../organizations/accountService";
import { getAccounts } from "../organizations/organizationService";
import { getCache, setCache } from "../../../../cache/resourceCache";
import { 
    getEksClusters 
} from "./eksService";

import { EksContext } from "../../../../types/services/awsConstext";
import { EksCluster } from "../../../../types/services/eks";

export const refreshEksOrganizationCache = async (
    organizationId: string,
    region: string
) => {
    const start = Date.now();

    try {
        const cacheKey =
            `eks:${organizationId}:${region}`;

        const accounts =
            await getAccounts(
                organizationId
            );
                
        const clusters = await Promise.all(
            accounts.map(async account => {
                const credentials = 
                    await getAccountCredentials(
                        organizationId,
                        account.id,
                        region
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
        const elapsed = Date.now() - start;

        console.log(
            `[EKS] ${organizationId} | ${region} | ${allClusters.length} instances | ${elapsed} ms`
        );

        return allClusters;

    }catch (error) {

        const elapsed = Date.now() - start;

        console.error(
            `[EKS] ${organizationId} | ${region} | ERROR | ${elapsed} ms`,
            error
        );
        throw error;
    }
}

export const getEksClustersFromOrganization = async (
    organizationId: string,
    region: string,
    accountId?: string
) => {

    const cacheKey =
        `eks:${organizationId}:${region}`;

    let clusters =
        getCache<EksCluster[]>(cacheKey);

    if (!clusters) {

        console.log("EKS CACHE MISS");

        clusters =
            await refreshEksOrganizationCache(
                organizationId,
                region
            );

    } else {

        console.log("EKS CACHE HIT");

    }

    if (accountId && accountId !== "all") {

        return clusters.filter(
            cluster =>
                cluster.accountId === accountId
        );

    }

    return clusters;
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
