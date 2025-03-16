import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from "../config";


export const mysql = new Sequelize(
    {
        database: DB_NAME,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        host: DB_HOST,
        dialect: 'mysql'
    }
)

export async function dbConnection() {
    try {
        await mysql.authenticate();
        await mysql.sync({ force: false });
        console.log(`== Connection has been established successfully! ==`)
    } catch (error) {
        console.log(`unable to connect to database:`, error)
    }
}