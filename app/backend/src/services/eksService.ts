import {
    ListClustersCommand,
    DescribeClusterCommand,
    ListNodegroupsCommand,
    DescribeNodegroupCommand
} from "@aws-sdk/client-eks";
import { eksClient } from "../aws/eksClient";


export const getEksClusters = async () => {
    
    const response = await eksClient.send(
    new ListClustersCommand({})
    );

    const clusterNames = response.clusters ?? [];
    
    return Promise.all(
    clusterNames.map(async (name) => {

        const cluster = await eksClient.send(
        new DescribeClusterCommand({
            name,
        })
        );
        

    const nodeGroupsResponse = await eksClient.send(
    new ListNodegroupsCommand({
        clusterName: name,
    })
    );

    const nodeGroupNames =
    nodeGroupsResponse.nodegroups ?? [];

    let nodeCount = 0;

    const nodeGroups = await Promise.all(
    nodeGroupNames.map(async (nodeGroupName) => {

        const response = await eksClient.send(
        new DescribeNodegroupCommand({
            clusterName: name,
            nodegroupName: nodeGroupName,
        })
        );

        const ng = response.nodegroup!;

        nodeCount += ng.scalingConfig?.desiredSize ?? 0;

        return {
        name: ng.nodegroupName ?? "",

        status: ng.status ?? "",

        desiredSize:
            ng.scalingConfig?.desiredSize ?? 0,

        minSize:
            ng.scalingConfig?.minSize ?? 0,

        maxSize:
            ng.scalingConfig?.maxSize ?? 0,

        instanceType:
            ng.instanceTypes?.[0] ?? "",

        totalNodes: nodeCount, //revissar si esta bien el conteo
        
        avgCurrentMetrics: {
            cpu: 12,
            memory: 19,
            disk: 50,
            network: 13,
        },

        avgHistoryMetrics: {
            cpu: [],
            memory: [],
            disk: [],
            network: [],
        },
        nodes: [
            {
                id: "UnNodo",

                name: "El Nodo",

                account: "",
                organization: "",

                type: "m61.4xlarge",

                status: "Running",
                cloudWatchAgent: true,
                
                currentMetrics: {
                cpu: 3,
                memory: 34,
                disk: 56,
                network: 23,
                },

                historyMetrics: {
                cpu: 0,
                memory: 0,
                disk: 0,
                network: 0,
                },
            }
        ]

        };
    })
    );
  
    return {
        id: name,
        name: name,

        status: cluster.cluster?.status,

        version: cluster.cluster?.version,
        endpoint: cluster.cluster?.endpoint,

        nodeGroupCount: nodeGroups.length,
        nodeCount,

        nodeGroups,

        avgCurrentMetrics: {
            cpu: 34,
            memory: 29,
            disk: 20,
            network: 10,
        },

        avgHistoryMetrics: {
            cpu: [],
            memory: [],
            disk: [],
            network: [],
        },

        totalDesired: nodeCount,
        totalReady: nodeCount,
    }
    })


    );

}
{/* Servicio para resolver backend de clusters por id */}
export const getEksClusterById = async (
  id: string
) => {
  const eksClusters = await getEksClusters();

  return eksClusters.find(
    eksClusters => eksClusters.id === id
  );

}

/* Servicio para resolver backend de Node Groups por id */
export const getEksNodeGroupById = async (
  idCluster: string,
  idNodeGroup: string
) => {

  const eksClusters = await getEksClusters();

  const cluster = eksClusters.find(
    cluster => cluster.id === idCluster
  );

  if (!cluster) {
    return undefined;
  }

  return cluster.nodeGroups.find(
    nodeGroup => nodeGroup.name === idNodeGroup
  );
};