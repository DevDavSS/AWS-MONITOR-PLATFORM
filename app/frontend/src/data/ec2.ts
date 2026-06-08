/* Reemplazar por la informacion del backend cuando esta llegue */
export const instances = [
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
      cpu: [
        { time: "10:00", value: 25 },
        { time: "11:00", value: 30 },
        { time: "12:00", value: 45 },
        { time: "13:00", value: 38 },
      ],
      memory: [
        { time: "10:00", value: 60 },
        { time: "11:00", value: 65 },
        { time: "12:00", value: 70 },
        { time: "13:00", value: 68 },
      ],
      disk: [
        { time: "10:00", value: 40 },
        { time: "11:00", value: 42 },
        { time: "12:00", value: 43 },
        { time: "13:00", value: 44 },
      ],
      network: [
        { time: "10:00", value: 20 },
        { time: "11:00", value: 35 },
        { time: "12:00", value: 15 },
        { time: "13:00", value: 40 },
      ],
    },
  },

  {
    id: "i-048595",
    name: "srv-app-prod-02",
    account: "PROD-ERP",
    organization: "SOFOM",
    type: "t3.large",
    status: "Stopped",

    currentMetrics: {
      cpu: 0,
      memory: 0,
      disk: 42,
      network: 120,
    },

    historyMetrics: {
      cpu: [
        { time: "10:00", value: 13 },
        { time: "11:00", value: 23 },
        { time: "12:00", value: 23 },
        { time: "13:00", value: 45 },
      ],
      memory: [
        { time: "10:00", value: 60 },
        { time: "11:00", value: 60 },
        { time: "12:00", value: 60 },
        { time: "13:00", value: 60 },
      ],
      disk: [
        { time: "10:00", value: 40 },
        { time: "11:00", value: 42 },
        { time: "12:00", value: 43 },
        { time: "13:00", value: 44 },
      ],
      network: [
        { time: "10:00", value: 20 },
        { time: "11:00", value: 35 },
        { time: "12:00", value: 15 },
        { time: "13:00", value: 40 },
      ],
    },
  },

  {
    id: "i-0485643",
    name: "srv-app-prod-03",
    account: "PROD-ERP",
    organization: "SOFOM",
    type: "m6i.xlarge",
    status: "Running",

    currentMetrics: {
      cpu: 30,
      memory: 50,
      disk: 22,
      network: 130,
    },

    historyMetrics: {
      cpu: [
        { time: "10:00", value: 25 },
        { time: "11:00", value: 30 },
        { time: "12:00", value: 45 },
        { time: "13:00", value: 38 },
      ],
      memory: [
        { time: "10:00", value: 60 },
        { time: "11:00", value: 65 },
        { time: "12:00", value: 70 },
        { time: "13:00", value: 68 },
      ],
      disk: [
        { time: "10:00", value: 40 },
        { time: "11:00", value: 42 },
        { time: "12:00", value: 43 },
        { time: "13:00", value: 44 },
      ],
      network: [
        { time: "10:00", value: 20 },
        { time: "11:00", value: 35 },
        { time: "12:00", value: 15 },
        { time: "13:00", value: 40 },
      ],
    },
  },

  {
    id: "i-245663",
    name: "srv-app-prod-04",
    account: "ION",
    organization: "ION",
    type: "m5i.xlarge",
    status: "Running",

    currentMetrics: {
      cpu: 30,
      memory: 50,
      disk: 12,
      network: 220,
    },

    historyMetrics: {
      cpu: [
        { time: "10:00", value: 25 },
        { time: "11:00", value: 30 },
        { time: "12:00", value: 45 },
        { time: "13:00", value: 38 },
      ],
      memory: [
        { time: "10:00", value: 60 },
        { time: "11:00", value: 65 },
        { time: "12:00", value: 70 },
        { time: "13:00", value: 68 },
      ],
      disk: [
        { time: "10:00", value: 40 },
        { time: "11:00", value: 42 },
        { time: "12:00", value: 43 },
        { time: "13:00", value: 44 },
      ],
      network: [
        { time: "10:00", value: 20 },
        { time: "11:00", value: 35 },
        { time: "12:00", value: 15 },
        { time: "13:00", value: 40 },
      ],
    },
  },
];