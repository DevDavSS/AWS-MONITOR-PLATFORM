import { RDSClient } from "@aws-sdk/client-rds";

export const rdsClient = new RDSClient({
    region: "us-west-2",
});


