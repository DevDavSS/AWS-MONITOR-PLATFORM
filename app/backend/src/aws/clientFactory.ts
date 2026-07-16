import { EC2Client } from "@aws-sdk/client-ec2";
import { CloudWatch, CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { EKS, EKSClient } from "@aws-sdk/client-eks";
import { Organizations, OrganizationsClient } from "@aws-sdk/client-organizations";
import { RDS, RDSClient } from "@aws-sdk/client-rds";
import { AutoScalingClient } from "@aws-sdk/client-auto-scaling";
import { AwsCredentials } from "../types/services/aws";

const getClientConfig = (
    credentials: AwsCredentials,
    region: string
) => ({

    region,

    credentials: {

        accessKeyId:
            credentials.accessKeyId,

        secretAccessKey:
            credentials.secretAccessKey,

        sessionToken:
            credentials.sessionToken,

    },

});

// EC2 
export const createEc2Client = (
    credentials: AwsCredentials,
    region: string
) => {

    return new EC2Client(
        getClientConfig(credentials, region)
    );

};
// RDS
export const createRdsClient = (
    credentials: AwsCredentials,
    region: string
) => {

    return new RDSClient(
        getClientConfig(credentials, region)
    );

};
// EKS
export const createEksClient = (
    credentials: AwsCredentials,
    region: string
) => {

    return new EKSClient(
        getClientConfig(credentials, region)
    );

};
// CloudWatch
export const createCloudWatchClient = (
    credentials: AwsCredentials,
    region: string
) => {

    return new CloudWatchClient(
        getClientConfig(credentials, region)
    );

};

// Auto Scaling
export const createAutoScalingClient = (
    credentials: AwsCredentials,
    region: string
) => {

    return new AutoScalingClient(
        getClientConfig(credentials, region)
    );

};

// Organizations
export const createOrganizationsClient = (
    credentials: AwsCredentials,
    region: string = "us-west-2"
) => {

    return new OrganizationsClient(
        getClientConfig(credentials, region)
    );

};