import {
  GetMetricDataCommand,
  ListMetricsCommand
} from "@aws-sdk/client-cloudwatch";

import { cloudWatchClient } from "../aws/cloudWatchClient";


{/*------------------------------------------------------------EC2 SERVICE FUNCTIONS----------------------------------------------- */}
{/* Optaining the CPU usage metrics */}

export const getCpuMetrics = async (
    instanceId: string
) => {
    
    const endTime = new Date();

    const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
    );
    const command = new GetMetricDataCommand({
        StartTime: startTime,
        EndTime: endTime,

        MetricDataQueries: [
            {
            Id: "cpu",
            MetricStat: {
                Metric: {
                Namespace: "AWS/EC2",
                MetricName: "CPUUtilization",
                Dimensions: [
                    {
                    Name: "InstanceId",
                    Value: instanceId,
                    },
                ],
                },

                Period: 300,
                Stat: "Average",
            },

            ReturnData: true,
            },
        ],
    });
    const response = await cloudWatchClient.send(command);
    const result = response.MetricDataResults?.[0];
    const response_1 = await cloudWatchClient.send(
    new ListMetricsCommand({
        Namespace: "CWAgent",
        MetricName: "mem_used_percent",
    })
    );

    console.log(
    response_1.Metrics?.slice(0, 20)
    );
    
    const history = result?.Timestamps?.map(
    (time, index) => ({
        time: time.toISOString(),
        value: result.Values?.[index] ?? 0,
    })
    ) ?? [];
    const current = history[history.length - 1]?.value ?? 0;
    return {
        current,
        history,    
    };
}

{/* Optaining the RAM memory metrics */}
export const getMemoryMetrics = async (
  instanceId: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "memory",

        MetricStat: {
          Metric: {
            Namespace: "CWAgent",

            MetricName: "mem_used_percent",

            Dimensions: [
              {
                Name: "InstanceId",
                Value: instanceId,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });
  

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map(
      (time, index) => ({
        time: time.toISOString(),
        value: result.Values?.[index] ?? 0,
      })
    ) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
    hasAgent: history.length > 0,
  };
};

 {/*OPtaining disk space usage -------------------------------------------------------------------*/}

 export const getDiskUsageMetric = async (
  instanceId: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "disk",

        MetricStat: {
          Metric: {
            Namespace: "CWAgent",
            MetricName: "disk_used_percent",
            Dimensions: [
              {
                Name: "InstanceId",
                Value: instanceId
              }
            ]
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });
  

  const response =
    await cloudWatchClient.send(command);


  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map(
      (time, index) => ({
        time: time.toISOString(),
        value: result.Values?.[index] ?? 0,
      })
    ) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};

 {/*OPtaining Network traffic  -------------------------------------------------------------------*/}

 export const getNetworkTraffic = async (
  instanceId: string
 ) => {
  
  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const bytesToMB = (
    bytes: number
  ) => bytes / 1024 / 1024;
  
  const command = new GetMetricDataCommand({
  StartTime: startTime,
  EndTime: endTime,

  MetricDataQueries: [
    {
      Id: "network",

      MetricStat: {
        Metric: {
          Namespace: "AWS/EC2",
          MetricName: "NetworkIn",
          Dimensions: [
            {
              Name: "InstanceId",
              Value: instanceId,
            },
          ],
        },

        Period: 300,
        Stat: "Average",
      },

      ReturnData: true,
      },
    ],
  });
  const response =
  await cloudWatchClient.send(command);


  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map(
      (time, index) => ({
        time: time.toISOString(),
        value: bytesToMB(result.Values?.[index] ?? 0,),
      })
    ) ?? [];
  
  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
 }

 
{/*------------------------------------------------------------RDS SERVICE FUNCTIONS----------------------------------------------- */}

export const getRdsCpuMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "cpu",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "CPUUtilization",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response = await cloudWatchClient.send(command);

  const result = response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: result.Values?.[index] ?? 0,
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsMemoryMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );
  function bytesToGB(bytes: number): number {
    return Number((bytes / (1024 ** 3)).toFixed(2));
  }

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "memory",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "FreeableMemory",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);
  
  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: bytesToGB(result.Values?.[index] ?? 0),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsConnectionsMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "connections",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "DatabaseConnections",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number((result.Values?.[index] ?? 0)),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsNetworkInMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  function bytesToMB(bytes: number): number {
    return Number((bytes / (1024 * 1024)).toFixed(2));
  };

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "netwrokIn",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "NetworkReceiveThroughput",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: bytesToMB(result.Values?.[index] ?? 0,)
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};

export const getRdsNetworkOutMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "networkOut",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "NetworkTransmitThroughput",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: (result.Values?.[index] ?? 0) / (1024 * 1024), // MB/s
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsReadIopsMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "readIops",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "ReadIOPS",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number((result.Values?.[index] ?? 0).toFixed(0)),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsWriteIopsMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "writeIops",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "WriteIOPS",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number((result.Values?.[index] ?? 0).toFixed(0)),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsReadThroughputMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "readThroughput",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "ReadThroughput",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number(
        (((result.Values?.[index] ?? 0) / (1024 ** 2)).toFixed(2))
      ),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsWriteThroughputMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "writeThroughput",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "WriteThroughput",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number(
        (((result.Values?.[index] ?? 0) / (1024 ** 2)).toFixed(2))
      ),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsReadLatencyMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  function secondsToMs (seconds: number): number {
    return Number((seconds * 1000).toFixed(2));
  };

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "readLatency",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "ReadLatency",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: secondsToMs(result.Values?.[index] ?? 0),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsWriteLatencyMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  function secondsToMs (seconds: number): number {
    return Number((seconds * 1000).toFixed(2));
  };


  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "writeLatency",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "WriteLatency",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: secondsToMs(result.Values?.[index] ?? 0),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};


export const getRdsCommitThroughputMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "commitThroughput",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "CommitThroughput",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number((result.Values?.[index] ?? 0).toFixed(2)),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};

export const getRdsSelectThroughputMetrics = async (
  dbInstanceIdentifier: string
) => {

  const endTime = new Date();

  const startTime = new Date(
    endTime.getTime() - 4 * 60 * 60 * 1000
  );

  const command = new GetMetricDataCommand({
    StartTime: startTime,
    EndTime: endTime,

    MetricDataQueries: [
      {
        Id: "selectThroughput",

        MetricStat: {
          Metric: {
            Namespace: "AWS/RDS",
            MetricName: "SelectThroughput",
            Dimensions: [
              {
                Name: "DBInstanceIdentifier",
                Value: dbInstanceIdentifier,
              },
            ],
          },

          Period: 300,
          Stat: "Average",
        },

        ReturnData: true,
      },
    ],
  });

  const response =
    await cloudWatchClient.send(command);

  const result =
    response.MetricDataResults?.[0];

  const history =
    result?.Timestamps?.map((time, index) => ({
      time: time.toISOString(),
      value: Number((result.Values?.[index] ?? 0).toFixed(2)),
    })) ?? [];

  const current =
    history[history.length - 1]?.value ?? 0;

  return {
    current,
    history,
  };
};
