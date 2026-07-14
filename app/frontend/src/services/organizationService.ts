export async function getOrganizations(){
    const response = await fetch(
        "http://localhost:3000/api/organizations"
    );

  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }
  if (!response.ok) {
    throw new Error(
      `Error fetching organizationd: ${response.statusText}`
    );
  }
  return response.json();
}

export async function getAccounts(
    organizationId: string
){
    const response = await fetch(
        `http://localhost:3000/api/organizations/${organizationId}/accounts`
    );

  if (!response.ok) {
    throw new Error("Failed to fetch organization Accounts:");
  }
  if (!response.ok) {
    throw new Error(
      `Error fetching organizationd: ${response.statusText}`
    );
  }
  return response.json();
}

