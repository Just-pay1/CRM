import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import { MERCHANT_USERS_QUEUE, RABBITMQ_URL } from "../config";

class RabbitMQ {
    private static instance: RabbitMQ;
    private connection!: ChannelModel;
    private producerChannels!: Map<string, Channel>;
    private consumerChannels!: Map<string, Channel>;
    private readonly url = RABBITMQ_URL || "amqp://localhost";

    private constructor() {
        this.producerChannels = new Map();
        this.consumerChannels = new Map();
    }

    public static async getInstance(): Promise<RabbitMQ> {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
            await RabbitMQ.instance.init();
        }
        return RabbitMQ.instance;
    }

    private async init(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.url);
            console.log('== RabbitMQ Connected ==');
        } catch (error) {
            console.error('RabbitMQ Connection Error:', error);
        }
    }

    private async getConsumerChannel(queue: string): Promise<Channel> {
        if (this.consumerChannels.has(queue)) {
            return this.consumerChannels.get(queue)!;
        }

        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue, { durable: true }); // Ensures queue exists
        this.consumerChannels.set(queue, channel); // Store the created channel

        console.log(`Created channel for queue: ${queue}`);
        return channel;
    }

    private async getProducerChannel(queue: string): Promise<Channel> {
        if (this.producerChannels.has(queue)) {
            return this.producerChannels.get(queue)!;
        }

        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue, { durable: true }); // Ensures queue exists
        this.producerChannels.set(queue, channel); // Store the created channel

        console.log(`Created channel for queue: ${queue}`);
        return channel;
    }

    public async sendToQueue(queue: string, message: any): Promise<void> {
        const channel = await this.getProducerChannel(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`Message sent to ${queue}:`, message);
    }

    public async consumeQueue(queue: string, callback: (msg: any) => void): Promise<void> {
        const channel = await this.getConsumerChannel(queue);
        await channel.consume(queue, async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString());
                await callback(content);
                channel.ack(msg);
            }
        });
        console.log(`Consuming messages from ${queue}`);
    }

}

export default RabbitMQ;