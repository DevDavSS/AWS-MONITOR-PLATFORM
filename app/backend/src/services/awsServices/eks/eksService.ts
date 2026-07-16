import {
    ListClustersCommand,
    DescribeClusterCommand,
} from "@aws-sdk/client-eks";

import { getNodeGroups } from "./nodeGroupsService";
import { getAverageMetrics } from "./metricsService";
import { EksContext } from "../../../types/services/awsConstext";


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
                accountId: EksContext.accountId,
                organization: EksContext.organizationId,
                region: EksContext.region,

                status: cluster.cluster?.status!,

                version: cluster.cluster?.version!,

                endpoint: cluster.cluster?.endpoint!,

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

