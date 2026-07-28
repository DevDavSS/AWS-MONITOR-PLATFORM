import type { AlertService } from "@/types/Alert";


export const resourceTypeOptions = {

    ec2: [
        {
            value: "instance",
            label: "EC2 Instance"
        }
    ],

    rds: [
        {
            value: "database",
            label: "RDS Database"
        }
    ],

    eks: [
        {
            value: "cluster",
            label: "EKS Cluster"
        },
        {
            value: "nodegroup",
            label: "Node Group"
        },
        {
            value: "node",
            label: "Node"
        }
    ]

} satisfies Record<
    AlertService,
    {
        value: string;
        label: string;
    }[]
>;



export const metricOptions = {

    ec2: [
        {
            value: "cpu",
            label: "CPU"
        },
        {
            value: "memory",
            label: "Memory"
        },
        {
            value: "disk",
            label: "Disk"
        },
        {
            value: "network",
            label: "Network"
        }
    ],


    rds: [
        {
            value: "cpu",
            label: "CPU Utilization"
        },
        {
            value: "memory",
            label: "Memory"
        },
        {
            value: "connections",
            label: "Database Connections"
        },
        {
            value: "networkIn",
            label: "Network In"
        },
        {
            value: "networkOut",
            label: "Network Out"
        },
        {
            value: "readIops",
            label: "Read IOPS"
        },
        {
            value: "writeIops",
            label: "Write IOPS"
        },
        {
            value: "readThroughput",
            label: "Read Throughput"
        },
        {
            value: "writeThroughput",
            label: "Write Throughput"
        },
        {
            value: "readLatency",
            label: "Read Latency"
        },
        {
            value: "writeLatency",
            label: "Write Latency"
        },
        {
            value: "commitThroughput",
            label: "Commit Throughput"
        },
        {
            value: "selectThroughput",
            label: "Select Throughput"
        }
    ],

    eks: [
        {
            value: "cpu",
            label: "CPU"
        },
        {
            value: "memory",
            label: "Memory"
        },
        {
            value: "disk",
            label: "Disk"
        },
        {
            value: "network",
            label: "Network"
        }
    ]

} satisfies Record<
    AlertService,
    {
        value: string;
        label: string;
    }[]
>;