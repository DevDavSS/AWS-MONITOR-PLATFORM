export async function getEksClusters() {
  const response = await fetch(
    "http://localhost:3000/api/eks"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch RDS Databases");
  }
  if (!response.ok) {
    throw new Error(
      `Error fetching Node Group: ${response.statusText}`
    );
  }
  return response.json();
}

export async function getEksClustersById(id: string) {
  const response = await fetch(
    `http://localhost:3000/api/eks/${id}`
  );
  if (!response.ok) {
    throw new Error(
      `Error fetching Node Group: ${response.statusText}`
    );
  }
  return response.json();
}

export async function getEksNodeGroupById(
  clusterId: string,
  nodeGroupId: string
) {
  console.log(clusterId, nodeGroupId);
  const response = await fetch(
    `http://localhost:3000/api/eks/${clusterId}/nodegroups/${nodeGroupId}`
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching Node Group: ${response.statusText}`
    );
  }

  return response.json();
}