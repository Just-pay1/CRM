import { app } from "./app";
import { dbConnection } from "./db/config";
import RabbitMQ from "./rabbitMQ/rabbitmq";

const port = app.get("port");

async function startApp() {
    await dbConnection();
    // const rabbitMQ = await RabbitMQ.getInstance();
}

const server = app.listen(port, () => {
    console.log(`Listening on ${port}`);
    startApp();
})