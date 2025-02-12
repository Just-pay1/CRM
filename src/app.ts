import express from "express"
import bodyParser from "body-parser" 
import { errorHandler, errorNotFoundHandler } from "./middlewares/error-handler";
import MainRoute from "./routes/index";
import { PORT } from "./config";

export const app =  express();
const mainRoute = new MainRoute();


// set app configuration 
app.set("port", PORT || 3000);
// app.set("port", 4000);



// common middlewares
app.use(bodyParser.json());

app.use("/api", mainRoute.router)
app.use(errorNotFoundHandler);
app.use(errorHandler);