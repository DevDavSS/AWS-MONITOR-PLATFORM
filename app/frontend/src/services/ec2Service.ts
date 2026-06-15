export async function getEc2Instances() {
  const response = await fetch(
    "http://localhost:3000/api/ec2"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch EC2 instances");
  }

  return response.json();
}

export async function getEc2InstanceById(id: string) {
  const response = await fetch(
    `http://localhost:3000/api/ec2/${id}`
  );

  return response.json();
}