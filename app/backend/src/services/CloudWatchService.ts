import {
  GetMetricDataCommand,
  ListMetricsCommand
} from "@aws-sdk/client-cloudwatch";

import { cloudWatchClient } from "../aws/cloudWatchClient";

{/* Optaining the CPU usage metrics */}

export const getCpuMetrics = async (
    instanceId: string
) => {
    
    const endTime = new Date();

    const startTime = new Date(
    endTime.getTime() - 6 * 60 * 60 * 1000
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
    endTime.getTime() - 6 * 60 * 60 * 1000
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