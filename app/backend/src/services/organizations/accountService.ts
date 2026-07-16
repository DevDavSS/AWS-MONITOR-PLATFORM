import { AwsCredentials } from "../../types/aws";

import {
    assumeManagementRole,
    assumeMemberRole
} from "./roleService";

import {
    getCredentials,
    setCredentials
} from "../../cache/credentialCache";

// Obtener credenciales STS de una cuenta miembro
export const getAccountCredentials = async (
    organizationId: string,
    accountId: string
): Promise<AwsCredentials> => {

    const cacheKey =
        `${organizationId}:${accountId}`;

    const cachedCredentials =
        getCredentials(cacheKey);

    if (
        cachedCredentials &&
        cachedCredentials.expiration.getTime() >
            Date.now() + 30_000
    ) {
        console.log(`STS Cache HIT -> ${cacheKey}`);
        return cachedCredentials;
    }
    console.log(`STS Cache MISS -> ${cacheKey}`);
    const managementCredentials =
        await assumeManagementRole(
            organizationId
        );

    const memberCredentials =
        await assumeMemberRole(
            accountId,
            managementCredentials
        );

    setCredentials(
        cacheKey,
        memberCredentials
    );

    return memberCredentials;

};