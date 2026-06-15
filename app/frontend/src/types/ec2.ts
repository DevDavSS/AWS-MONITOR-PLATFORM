/* Metric Point Interface para representar puntos de métrica */
export interface MetricPoint {
  time: string;
  value: number;
}

/* EC2 Instance Interface para la representación de instancias EC2 (Actualizar si se necesitan mas campos) */
export interface EC2Instance {
  id: string;
  name: string;
  account: string;
  organization: string;
  type: string;
  status: string;

  cloudWatchAgent: false,

  currentMetrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };

  historyMetrics: {
    cpu: MetricPoint[];
    memory: MetricPoint[];
    disk: MetricPoint[];
    network: MetricPoint[];
  };
}