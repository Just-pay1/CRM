import * as dotenv from 'dotenv';
import { decrypt } from '../utilities/encrypt-decrypt';

dotenv.config();

// this data will be also encrypted and decrypted when the server is ready 

// APP CONFIG
export const PORT = process.env.PORT;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// SERVICES URLS 
export const MERCHANT_URL = process.env.MERCHANT_URL;
export const MOBILE_URL = process.env.MOBILE_URL;
export const CORE_URL = process.env.CORE_URL;

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
export const RABBITMQ_URL = process.env.RABBITMQ_URL;
export const MERCHANT_USERS_QUEUE = process.env.MERCHANT_USERS_QUEUE;