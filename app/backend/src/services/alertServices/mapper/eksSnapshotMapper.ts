import { ResourceSnapshot } from "../../../types/alert/ResurceSnapshot";
import { EksCluster } from "../../../types/services/eks";


export const mapEksSnapshots = (
    clusters: EksCluster[]
): ResourceSnapshot[] => {

    const snapshots: ResourceSnapshot[] = [];

    for (const cluster of clusters) {

        // Cluster
        snapshots.push({

            organizationId: cluster.organization,

            accountId: cluster.accountId,

            region: cluster.region,

            service: "eks",

            resourceType: "cluster",

            resourceId: cluster.id,

            resourceName: cluster.name,

            metricas: {

                cpu: cluster.avgCurrentMetrics.cpu,

                memory: cluster.avgCurrentMetrics.memory,

                disk: cluster.avgCurrentMetrics.disk,

                network: cluster.avgCurrentMetrics.network,

            }

        });

        for (const nodeGroup of cluster.nodeGroups) {

            // NodeGroup
            snapshots.push({

                organizationId: cluster.organization,

                accountId: cluster.accountId,

                region: cluster.region,

                service: "eks",

                resourceType: "nodegroup",

                resourceId: nodeGroup.name,

                resourceName: nodeGroup.name,

                metricas: {

                    cpu: nodeGroup.avgCurrentMetrics.cpu,

                    memory: nodeGroup.avgCurrentMetrics.memory,

                    disk: nodeGroup.avgCurrentMetrics.disk,

                    network: nodeGroup.avgCurrentMetrics.network,

                }

            });

            // Nodes
            for (const node of nodeGroup.nodes) {

                snapshots.push({

                    organizationId: node.organization,

                    accountId: node.accountId,

                    region: cluster.region,

                    service: "eks",

                    resourceType: "node",

                    resourceId: node.id,

                    resourceName: node.name,

                    metricas: {

                        cpu: node.currentMetrics.cpu,

                        memory: node.currentMetrics.memory,

                        disk: node.currentMetrics.disk,

                        network: node.currentMetrics.network,

                    }

                });

            }

        }

    }

    return snapshots;

};