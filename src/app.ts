import express from "express"
import bodyParser from "body-parser" 
import { errorHandler, errorNotFoundHandler } from "./middlewares/error-handler";
import MainRoute from "./routes/index";
import * as dotenv from 'dotenv';

export const app =  express();
const mainRoute = new MainRoute();
dotenv.config();


// set app configuration 
app.set("port", process.env.PORT || 3000);
// app.set("port", 4000);



// common middlewares
app.use(bodyParser.json());

app.use("/api", mainRoute.router)
app.use(errorNotFoundHandler);
app.use(errorHandler);