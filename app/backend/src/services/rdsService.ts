import {
  DescribeDBClustersCommand,
  DescribeDBInstancesCommand,
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

} from "./CloudWatchService";
import { rdsClient } from "../aws/rdsClient";
import { read } from "node:fs";


export const getAuroraRDSAws = async () => {

const [clustersRes, instancesRes] = await Promise.all([
  rdsClient.send(new DescribeDBClustersCommand({})),
  rdsClient.send(new DescribeDBInstancesCommand({})),
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
          getRdsCpuMetrics(instanceId),
          getRdsMemoryMetrics(instanceId),
          getRdsConnectionsMetrics(instanceId),
          getRdsNetworkInMetrics(instanceId),
          getRdsNetworkOutMetrics(instanceId),
          getRdsReadIopsMetrics(instanceId),
          getRdsWriteIopsMetrics(instanceId),
          getRdsReadThroughputMetrics(instanceId),
          getRdsWriteThroughputMetrics(instanceId),
          getRdsReadLatencyMetrics(instanceId),
          getRdsWriteLatencyMetrics(instanceId),
          getRdsCommitThroughputMetrics(instanceId),
          getRdsSelectThroughputMetrics(instanceId),
        ]);

        return {
          id: member.DBInstanceIdentifier ?? "",

          dbIdentifier: member.DBInstanceIdentifier ?? "",

          clusterIdentifier: clusterId,

          account: "",
          organization: "",
          region: "",

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

export const getAuroraRDSById = async (
  id: string
) => {

  const databases =
    await getAuroraRDSAws();

  return databases.find(
    database => database.id === id
  );
};