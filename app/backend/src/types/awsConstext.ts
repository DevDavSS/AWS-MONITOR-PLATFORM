import { EC2Client } from "@aws-sdk/client-ec2";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { EKSClient } from "@aws-sdk/client-eks";
import { RDSClient } from "@aws-sdk/client-rds";
import { AutoScalingClient } from "@aws-sdk/client-auto-scaling";

export interface awsBaseContext {

    organizationId: string;

    accountId: string;

    accountName: string;

    region: string;

    ec2Client: EC2Client;

    cloudWatchClient: CloudWatchClient;
}


export interface Ec2Context extends awsBaseContext {} //heredar atributos base

export interface EksContext extends awsBaseContext {
    
    eksClient: EKSClient;

    autoScalingClient: AutoScalingClient;

}

export interface RdsContext {

    organizationId: string;

    accountId: string;

    accountName: string;

    region: string;

    rdsClient: RDSClient;

    cloudWatchClient: CloudWatchClient;

}
