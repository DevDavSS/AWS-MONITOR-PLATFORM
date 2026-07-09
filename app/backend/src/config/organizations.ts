import dotenv from "dotenv";
dotenv.config();

export const organizations = [

    {
        id: "SOFOM",

        managementRoleArn:
            process.env.SOFOM_ROLE_ARN!
    },

    {
        id: "ION-Banco",

        managementRoleArn:
            process.env.ION_ROLE_ARN!
    }

];