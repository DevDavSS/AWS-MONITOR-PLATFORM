import { ResourceSnapshot } from "../../../types/alert/ResurceSnapshot";
import { RdsDatabase } from "../../../types/services/rds";

export const mapRdsSnapshots = (
    databases: RdsDatabase[]
): ResourceSnapshot[] => {

    return databases.map(database => ({

        organizationId: database.organization,

        accountId: database.accountId,

        region: database.region,

        service: "rds",

        resourceType: "database",

        resourceId: database.id,

        resourceName: database.dbIdentifier,

        metricas: {

            cpu: database.currentMetrics.cpu,

            memory: database.currentMetrics.memory,

            connections: database.currentMetrics.connections,

            networkIn: database.currentMetrics.networkIn,

            networkOut: database.currentMetrics.networkOut,

            readIops: database.currentMetrics.readIops,

            writeIops: database.currentMetrics.writeIops,

            readThroughput: database.currentMetrics.readThroughput,

            writeThroughput: database.currentMetrics.writeThroughput,

            readLatency: database.currentMetrics.readLatency,

            writeLatency: database.currentMetrics.writeLatency,

            commitThroughput: database.currentMetrics.commitThroughput,

            selectThroughput: database.currentMetrics.selectThroughput,

        }

    }));

};