console.log({
  ORG_ID_1: process.env.ORG_ID_1,
  ORG_NAME_1: process.env.ORG_NAME_1,
  ORG_1_MANAGEMENT_ROLE_ARN: process.env.ORG_1_MANAGEMENT_ROLE_ARN,
});
export const organizationsNoArn = [

    {
        id:process.env.ORG_ID_1,
        name:process.env.ORG_NAME_1,
    },

    {
        id: process.env.ORG_ID_2,
        name: process.env.ORG_NAME_2
    }

];


export const organizations = [

    {
        id: process.env.ORG_ID_1,

        managementRoleArn:process.env.ORG_1_MANAGEMENT_ROLE_ARN
    },

    {
        id: process.env.ORG_ID_2,

        managementRoleArn:process.env.ORG_2_MANAGEMENT_ROLE_ARN
    }

];