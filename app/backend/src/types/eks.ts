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
  name:         string; 

  status:       string; 

  desiredSize:  number; 
  minSize:      number; 
  maxSize:      number; 
  totalNodes:   number; 

  instanceType: string; 
  
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
  id:           string; 

  name:         string; 

  account:      string; 
  accountId:    string;
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

}