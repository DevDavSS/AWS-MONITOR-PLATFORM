import type { AwsFilters } from "@/contexts/FilterContext";

export const getEksClusters = async(
  filters: AwsFilters
) => {
    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `http://localhost:3000/api/eks?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error(
      `Error fetching Cluster: ${response.statusText}`
    );
  }
  return response.json();
}

export const getEksClustersById = async(
  id: string,
  filters: AwsFilters,
) => {
    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `http://localhost:3000/api/eks/${id}?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error(
      `Error fetching cluster: ${response.statusText}`
    );
  }
  return response.json();
}

export const getEksNodeGroupById= async(
  clusterId: string,
  nodeGroupId: string,
  filters: AwsFilters,
) => {
    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `http://localhost:3000/api/eks/${clusterId}/nodegroups/${nodeGroupId}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching Node Group: ${response.statusText}`
    );
  }

  return response.json();
}


export const getEksNodeById = async(
  clusterId: string,
  nodeGroupId: string,
  nodeId: string,
  filters: AwsFilters,
) => {
    const params = new URLSearchParams({

        organization: filters.organizationId,

        account: filters.accountId ?? "all",

        region: filters.region,

    });
  const response = await fetch(
    `http://localhost:3000/api/eks/${clusterId}/nodegroups/${nodeGroupId}/node/${nodeId}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching Node: ${response.statusText}`
    );
  }

  return response.json();
}