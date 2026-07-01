export async function getRdsDatabases() {
  const response = await fetch(
    "http://localhost:3000/api/rds"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch RDS Databases");
  }

  return response.json();
}

export async function getRdsDatabasesById(id: string) {
  const response = await fetch(
    `http://localhost:3000/api/rds/${id}`
  );

  return response.json();
}