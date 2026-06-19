// services/debugService.ts

import {
  ListMetricsCommand
} from "@aws-sdk/client-cloudwatch";

import {
  cloudWatchClient
} from "../aws/cloudWatchClient";

export const getCWAgentMetrics = async () => {

  const response =
    await cloudWatchClient.send(
      new ListMetricsCommand({
        Namespace: "CWAgent",
        MetricName: "mem_used_percent",
      })
    );

  return response.Metrics ?? [];
};

