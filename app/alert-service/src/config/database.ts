import { Pool } from "pg";

export const db =  new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "Arg3ntinaPerdi02026.^_^",
    database: "alerts_db"

})