import {
    ListNodegroupsCommand,
    DescribeNodegroupCommand,
    Nodegroup$,
} from "@aws-sdk/client-eks";
import { getNodesFromNodeGroup } from "./nodeAsgService";
import { eksClient } from "../../aws/eksClient";
import { getAverageMetrics } from "./metricsService";


export const getNodeGroups = async (
    clusterName: string
) => {

    const nodeGroupsResponse =
        await eksClient.send(

            new ListNodegroupsCommand({
                clusterName,
            })

        );

    const nodeGroupNames =
        nodeGroupsResponse.nodegroups ?? [];
    
    
    return Promise.all(

        nodeGroupNames.map(async (nodeGroupName) => {

            const response =
                await eksClient.send(

                    new DescribeNodegroupCommand({
                        clusterName,
                        nodegroupName: nodeGroupName,
                    })

                );

            const ng =
                response.nodegroup!;

            const nodes = await getNodesFromNodeGroup(clusterName,nodeGroupName )
            const metrics = getAverageMetrics(nodes)

            return {

                name:
                    ng.nodegroupName ?? "",

                status:
                    ng.status ?? "",

                desiredSize:
                    ng.scalingConfig?.desiredSize ?? 0,

                minSize:
                    ng.scalingConfig?.minSize ?? 0,

                maxSize:
                    ng.scalingConfig?.maxSize ?? 0,

                instanceType:
                    ng.instanceTypes?.[0] ?? "",

                totalNodes:
                    ng.scalingConfig?.desiredSize ?? 0,

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

                nodes: nodes
            };
        })
    );
};