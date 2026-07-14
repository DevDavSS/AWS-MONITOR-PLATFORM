import { AwsCredentials } from "../../types/aws";

import {
    assumeManagementRole,
    assumeMemberRole
} from "./roleService";

// Obtener credenciales STS de una cuenta miembro
export const getAccountCredentials = async (
    organizationId: string,
    accountId: string
): Promise<AwsCredentials> => {

    const managementCredentials =
        await assumeManagementRole(
            organizationId
        );

    return await assumeMemberRole(
        accountId,
        managementCredentials
    );

};