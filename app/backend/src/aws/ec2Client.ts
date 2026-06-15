import { EC2Client } from "@aws-sdk/client-ec2";

/*Cliente para EC2 region de Oregon */

export const ec2Client = new EC2Client({
    region: "us-west-2",
});


