import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';


dotenv.config();

export const mysql = new Sequelize(
    {
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
)

export async function dbConnection() {
    try {
        await mysql.authenticate();
        await mysql.sync({ force: false });
        console.log(`Connection has been established successfully!`)
    } catch (error) {
        console.log(`unable to connect to database:`, error)
    }
}