import { AwsCredentials } from "../../types/aws";
import { assumeMemberRole } from "./roleService";

// obtener credentiales ata de la cuenta
export const getAccountCredentials = async (
    accountId: string
):Promise<AwsCredentials> => {
    return await assumeMemberRole(
        accountId
    );
}