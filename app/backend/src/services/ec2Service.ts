import { EC2Instance } from "../types/ec2";

/* Temporary mock data for EC2 instances */
const instances: EC2Instance[] = [
  {
    id: "i-048594",
    name: "srv-app-prod-01",
    account: "PROD-ERP",
    organization: "SOFOM",
    type: "t3.large",
    status: "Running",

    currentMetrics: {
      cpu: 35,
      memory: 61,
      disk: 45,
      network: 90,
    },

    historyMetrics: {
      cpu: [],
      memory: [],
      disk: [],
      network: [],
    },
  },
];

export const getEc2Instances = (): EC2Instance[] => {
  return instances;
};