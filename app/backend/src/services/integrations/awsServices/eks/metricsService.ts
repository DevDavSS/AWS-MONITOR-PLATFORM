import type { EC2Instance, MetricPoint } from "../../../../types/services/ec2";

const averageCurrentMetrics = (
  instances: EC2Instance[]
) => {

  const total = instances.length || 1;

  return {

    cpu:
      instances.reduce(
        (sum, i) => sum + i.currentMetrics.cpu,
        0
      ) / total,

    memory:
      instances.reduce(
        (sum, i) => sum + i.currentMetrics.memory,
        0
      ) / total,

    disk:
      instances.reduce(
        (sum, i) => sum + i.currentMetrics.disk,
        0
      ) / total,

    network:
      instances.reduce(
        (sum, i) => sum + i.currentMetrics.network,
        0
      ) / total,
  };
};

const averageHistoryMetric = (
  histories: MetricPoint[][]
): MetricPoint[] => {

  if (histories.length === 0) {
    return [];
  }

  const totalInstances = histories.length;

  return histories[0].map((point, index) => ({

    time: point.time,

    value:

      histories.reduce(

        (sum, history) =>
          sum + (history[index]?.value ?? 0),

        0

      ) / totalInstances,

  }));

};


const averageHistoryMetrics = (
  instances: EC2Instance[]
) => {

  return {

    cpu: averageHistoryMetric(
      instances.map(i => i.historyMetrics.cpu)
    ),

    memory: averageHistoryMetric(
      instances.map(i => i.historyMetrics.memory)
    ),

    disk: averageHistoryMetric(
      instances.map(i => i.historyMetrics.disk)
    ),

    network: averageHistoryMetric(
      instances.map(i => i.historyMetrics.network)
    ),

  };

};

export const getAverageMetrics = (instances: EC2Instance[]) => {
  return {
    current: averageCurrentMetrics(instances),
    history: averageHistoryMetrics(instances),
  };
};