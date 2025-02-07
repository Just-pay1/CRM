import { app } from "./app";
import { dbConnection } from "./db/config";

const port = app.get("port");
const server = app.listen(port, () => {
    console.log(`Listening on ${port}`);
    dbConnection();
})