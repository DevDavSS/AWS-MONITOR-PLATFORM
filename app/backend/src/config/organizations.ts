import dotenv from "dotenv";
dotenv.config({});


export const organizationsNoArn = [

    {
        id: "sofom",
        name:"Sofom"
    },

    {
        id: "ION-Banco",
        name: "ION-Banco"
    }

];


export const organizations = [

    {
        id: "sofom",

        managementRoleArn:"arn:aws:iam::822146368044:role/MonitoringManagementRole"
    },

    {
        id: "ION-Banco",

        managementRoleArn:"arn:aws:iam::715841324715:role/MonitoringManagementRole"
    }

];