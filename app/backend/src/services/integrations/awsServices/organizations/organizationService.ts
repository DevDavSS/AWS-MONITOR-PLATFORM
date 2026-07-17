import { ListAccountsCommand } from "@aws-sdk/client-organizations";
import { assumeManagementRole } from "./roleService";
import { createOrganizationsClient } from "../../../../aws/clientFactory";
import { OrganizationAccount } from "../../../../types/services/organization";


export const getAccounts = async (
    organizationId: string
): Promise<OrganizationAccount[]> => {

    const credentials = 
        await assumeManagementRole(
            organizationId
        );
    
    const OrganizationsClient =
        await createOrganizationsClient(
            credentials
        );
    
    const response =
        await OrganizationsClient.send(
            new ListAccountsCommand({})
        );

    return (
        response.Accounts ?? []
    ).map(account => ({

        id:
            account.Id ?? "",

        name:
            account.Name ?? "",

        email:
            account.Email ?? "",

        status:
            account.State ??
            
            account.Status ??
            "",

    }));
}

// export const getAccountsById = async (
//     organizationId: string,
//     accountId: string
// ) => {

//     const accounts = await getAccounts(organizationId);

//     return accounts.find(
//         account => account.id === accountId
//     );
// }