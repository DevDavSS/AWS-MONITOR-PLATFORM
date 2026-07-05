/* Metric Point Interface para representar puntos de métrica */
export interface MetricPoint {
  time: string;
  value: number;
}

/* Node Group Interface */
export interface NodeGroup {
  name:         string;

  status:       string;

  desiredSize:  number;
  minSize:      number;
  maxSize:      number;

  instanceType: string;
}

/* EKS Node Interface */
export interface EksNode {
  id:           string;
  name:         string;

  status:       string;

  currentMetrics: {
    cpu:        number;
    memory:     number;
    disk:       number;
    network:    number;
  };

  historyMetrics: {
    cpu:        MetricPoint[];
    memory:     MetricPoint[];
    disk:       MetricPoint[];
    network:    MetricPoint[];
  };
}

/* EKS Cluster Interface */
export interface EksCluster {
  id:           string;

  name:         string;

  account:      string;
  organization: string;
  region:       string;

  status:       string;

  version:      string;

  endpoint:     string;

  totalDesired: number;
  totalReady:   number;
  nodeGroupCount: number;
  nodeCount: number;

  avgCurrentMetrics: {
    cpu:        number;        /*AVG cpu percentage */
    memory:     number;     /*AVG memory usage percentage */
    disk:       number;
    network:    number;
  };

  avgHistoryMetrics: {
    cpu:        MetricPoint[];        /*AVG cpu percentage */
    memory:     MetricPoint[];     /*AVG memory usage percentage */
    disk:       MetricPoint[];
    network:    MetricPoint[];
  };

  nodeGroups: NodeGroup[];

  nodes: EksNode[];
}