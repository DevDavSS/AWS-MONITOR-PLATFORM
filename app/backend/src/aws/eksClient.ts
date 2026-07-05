import { EKSClient } from "@aws-sdk/client-eks";

export const eksClient = new EKSClient({
    region: "us-west-2",
});