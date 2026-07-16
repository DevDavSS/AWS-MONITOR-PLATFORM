import { AwsCredentials } from "../types/services/aws";

const credentialCache = new Map<
    string,
    AwsCredentials
>();

export const getCredentials = (
    key: string
): AwsCredentials | undefined => {

    return credentialCache.get(key);
};

export const setCredentials = (
    key: string,
    credentials: AwsCredentials
): void => {

    credentialCache.set(
        key,
        credentials
    );

};

export const clearCredentials = (): void => {

    credentialCache.clear();

};