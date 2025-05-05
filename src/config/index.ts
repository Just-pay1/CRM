import * as dotenv from 'dotenv';
import { decrypt } from '../utilities/encrypt-decrypt';
import path from 'path';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

console.log(`Server running in ${env} mode on port ${process.env.PORT}`);
// this data will be also encrypted and decrypted when the server is ready 

// APP CONFIG
export const PORT = process.env.PORT;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// SERVICES URLS 
export const MERCHANT_URL = process.env.MERCHANT_URL;
export const BILLING_URL = process.env.BILLING_URL;

// console.log(BILLING_URL);

// DB VARIABLES 
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;

// NODEMAILER CONFIG 
export const EMAIL = decrypt(process.env.EMAIL!);
export const EMAIL_PASS = decrypt(process.env.EMAIL_PASS!);

// console.log(EMAIL, EMAIL_PASS);

// RABBITMQ 
export const RABBITMQ_IP = process.env.RABBITMQ_IP;
export const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
export const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
export const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;
export const ACTIVE_MERCHANTS = process.env.ACTIVE_MERCHANTS;
export const MAILS_QUEUE = process.env.MAILS_QUEUE