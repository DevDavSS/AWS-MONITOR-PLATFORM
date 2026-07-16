import {
  DescribeDBClustersCommand,
  DescribeDBInstancesCommand,
  RDSClient
} from "@aws-sdk/client-rds";
import { 
  getRdsCpuMetrics, 
  getRdsMemoryMetrics,
  getRdsConnectionsMetrics, 
  getRdsNetworkInMetrics,
  getRdsNetworkOutMetrics,
  getRdsReadIopsMetrics,
  getRdsWriteIopsMetrics, 
  getRdsReadThroughputMetrics,
  getRdsWriteThroughputMetrics,
  getRdsReadLatencyMetrics,
  getRdsWriteLatencyMetrics,
  getRdsCommitThroughputMetrics,
  getRdsSelectThroughputMetrics,

} from "../cloudwatch/CloudWatchService";

import { RdsContext } from "../../../types/services/awsConstext";

export const getAuroraRDSAws = async (
  rdsConstext: RdsContext
) => {

const [clustersRes, instancesRes] = await Promise.all([
  rdsConstext.rdsClient.send(new DescribeDBClustersCommand({})),
  rdsConstext.rdsClient.send(new DescribeDBInstancesCommand({})),
]);

const clusters = clustersRes.DBClusters ?? [];
const instances = instancesRes.DBInstances ?? [];

return Promise.all(
  clusters
    .filter(c => c.Engine?.startsWith("aurora"))
    .flatMap(cluster =>
      (cluster.DBClusterMembers ?? []).map(async member => {

        const instance = instances.find(
          i => i.DBInstanceIdentifier === member.DBInstanceIdentifier
        );

        const clusterId = cluster.DBClusterIdentifier!;
        const instanceId = instance?.DBInstanceIdentifier!;
        /* CloudWatch metrics */
        const [
          cpu, 
          memory, 
          connections, 
          netwrokin, 
          networkout, 
          readIops, 
          writeIops, 
          readThroughput, 
          writeThroughput,
          readLatency,
          writeLatency, 
          commitThroughput,
          selectThroughput,
        ] = await Promise.all([
          getRdsCpuMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsMemoryMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsConnectionsMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsNetworkInMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsNetworkOutMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsReadIopsMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsWriteIopsMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsReadThroughputMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsWriteThroughputMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsReadLatencyMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsWriteLatencyMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsCommitThroughputMetrics(instanceId, rdsConstext.cloudWatchClient),
          getRdsSelectThroughputMetrics(instanceId, rdsConstext.cloudWatchClient),
        ]);

        return {
          id: member.DBInstanceIdentifier ?? "",

          dbIdentifier: member.DBInstanceIdentifier ?? "",

          clusterIdentifier: clusterId,

          account: rdsConstext.accountName,
          accountId: rdsConstext.accountId,
          organization: rdsConstext.organizationId,
          region: rdsConstext.region,

          engine: cluster.Engine ?? "",

          role: member.IsClusterWriter ? "Writer" : "Reader",

          status: cluster.Status ?? "unknown",

          size: instance?.DBInstanceClass ?? "",

          currentMetrics: {
            cpu: cpu.current ?? 0,
            memory: memory.current ?? 0,
            connections: connections.current ?? 0,
            networkIn: netwrokin.current ?? 0,
            networkOut: networkout.current ?? 0,
            readIops: readIops.current ?? 0,
            writeIops: writeIops.current ?? 0,
            readThroughput: readThroughput.current ?? 0,
            writeThroughput: writeThroughput.current ?? 0,
            readLatency: readLatency.current ?? 0,
            writeLatency: writeLatency.current ?? 0,
            commitThroughput: commitThroughput.current ?? 0,
            selectThroughput: selectThroughput.current ?? 0,

          },

          historyMetrics: {
            cpu: cpu.history ?? 0,
            memory: memory.history ?? 0,
            connections: connections.history ?? 0,
            networkIn: netwrokin.history ?? 0,
            networkOut: networkout.history ?? 0,
            readIops: readIops.history ?? 0,
            writeIops: writeIops.history ?? 0,
            readThroughput: readThroughput.history ?? 0,
            writeThroughput: writeThroughput.history ?? 0,
            readLatency: readLatency.history ?? 0,
            writeLatency: writeLatency.history ?? 0,
            commitThroughput: commitThroughput.history ?? 0,
            selectThroughput: selectThroughput.history ?? 0,

          },
        };
      })
    )
);
};
