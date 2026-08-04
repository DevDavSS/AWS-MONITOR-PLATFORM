export interface OrganizationAccount {
    id: string;
    name: string;
}

export const getOrganizationAccounts = async (
    organizationId: string
): Promise<OrganizationAccount[]> => {

    const response = await fetch(
        `${process.env.SNAPSHOT_API_URL}/api/organizations/${organizationId}/accounts`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve organization accounts"
        );
    }

    const accounts =
        await response.json();

    return accounts.map((account:any) => ({
        id: account.id,
        name: account.name
    }));

};