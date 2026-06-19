import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";

export const cloudWatchClient = new CloudWatchClient({
    region: "us-west-2"
})