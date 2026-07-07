/*En la primera version se reuylizara la interfaz deEC2 instance para representar los nodos de EKS, 
si se necesitan añadir mas atributos propios de eks con la api de kubernetes,
se debera crear  una interfaz especifica */

import type { EC2Instance } from "./ec2";



/* Metric Point Interface para representar puntos de métrica */
export interface MetricPoint {
  time: string;
  value: number;
}

/* Node Group Interface */
export interface NodeGroup {
  name:         string; //OK

  status:       string; //OK

  desiredSize:  number; //OK
  minSize:      number; //OK
  maxSize:      number; //OK
  totalNodes:   number; //OK

  instanceType: string; //OK
  
  avgCurrentMetrics: {
    cpu:        number;        /*AVG cpu percentage */
    memory:     number;     /*AVG memory usage percentage per nodegroup*/
    disk:       number;
    network:    number;
  };

  avgHistoryMetrics: {
    cpu:        MetricPoint[];        /*AVG cpu percentage */
    memory:     MetricPoint[];     /*AVG memory usage percentage */
    disk:       MetricPoint[];
    network:    MetricPoint[];
  };
  nodes: EC2Instance[];
}


/* EKS Cluster Interface */
export interface EksCluster {
  id:           string; //OK

  name:         string; //ok

  account:      string; //wait
  organization: string; //wait
  region:       string; //wait

  status:       string; //ok

  version:      string; //ok

  endpoint:     string; //ok

  totalDesired: number; //ok
  totalReady:   number; //ok
  nodeGroupCount: number; //ok
  nodeCount: number; //ok

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

  nodeGroups: NodeGroup[]; //ok

}