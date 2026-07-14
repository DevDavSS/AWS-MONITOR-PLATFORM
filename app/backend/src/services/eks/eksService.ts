import {
    ListClustersCommand,
    DescribeClusterCommand,
} from "@aws-sdk/client-eks";

import { getNodeGroups } from "./nodeGroupsService";
import { getAverageMetrics } from "./metricsService";
import { EksContext } from "../../types/awsConstext";


export const getEksClusters = async (
    EksContext: EksContext,
) => {

    const response = await EksContext.eksClient.send(
        new ListClustersCommand({})
    );

    const clusterNames = response.clusters ?? [];

    return Promise.all(

        clusterNames.map(async (name) => {

            const cluster = await EksContext.eksClient.send(

                new DescribeClusterCommand({
                    name,
                })

            );

            const nodeGroups =
                await getNodeGroups(EksContext, name);

            const nodeCount =
                nodeGroups.reduce(
                    (sum, ng) => sum + ng.totalNodes,
                    0
                );

            const allNodes = nodeGroups.flatMap(
                ng => ng.nodes
            );
            const metrics = getAverageMetrics(allNodes)
            return {

                id: name,

                name,

                account: EksContext.accountName,
                organization: EksContext.organizationId,
                region: EksContext.region,

                status: cluster.cluster?.status,

                version: cluster.cluster?.version,

                endpoint: cluster.cluster?.endpoint,

                nodeGroupCount: nodeGroups.length,

                nodeCount,

                nodeGroups,

                avgCurrentMetrics: {
                    cpu: metrics.current.cpu,
                    memory: metrics.current.memory,
                    disk: metrics.current.disk,
                    network: metrics.current.network,
                },

                avgHistoryMetrics: {
                    cpu: metrics.history.cpu,
                    memory: metrics.history.memory,
                    disk: metrics.history.disk,
                    network: metrics.history.network,
                },

                totalDesired: nodeCount,
                totalReady: nodeCount,
            };
        })
    );
};

export const getEksClusterById = async (
    eksContext: EksContext,
    id: string,
) => {

    const clusters =
        await getEksClusters(eksContext);

    return clusters.find(
        cluster => cluster.id === id
    );
};

export const getEksNodeGroupById = async (
    eksContext: EksContext,
    clusterId: string,
    nodeGroupId: string
) => {

    const cluster =
        await getEksClusterById(eksContext,clusterId);

    if (!cluster) {
        return undefined;
    }

    return cluster.nodeGroups.find(
        nodeGroup =>
            nodeGroup.name === nodeGroupId
    );
}

export const getEksNodeById = async (
    eksContext: EksContext,
    clusterId: string,
    nodeGroupId: string,
    nodeId: string,
) => {

    const cluster =
        await getEksClusterById(eksContext,clusterId);
    const nodeGroup = 
        await getEksNodeGroupById(eksContext,clusterId, nodeGroupId)
        
    if (!cluster || !nodeGroup) {
        return undefined;
    }
    return nodeGroup.nodes.find(
        node =>
            node.id === nodeId
    );
}

