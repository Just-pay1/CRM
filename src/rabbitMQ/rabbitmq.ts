import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import { ACTIVE_MERCHANTS, RABBITMQ_IP, MAILS_QUEUE, RABBITMQ_PORT } from "../config";
import { MerchantAttributes } from "../utilities/common-interfaces";

// class RabbitMQ {
//     private static instance: RabbitMQ;
//     private connection!: ChannelModel;
//     private producerChannels!: Map<string, Channel>;
//     private consumerChannels!: Map<string, Channel>;
//     private readonly url = RABBITMQ_URL || "amqp://localhost";
//     private queues = {
//         billing_merchant: BILLING_MERCHANT_QUEUE,
//     }

//     // we need to add an object that conatain all queues we have
//     // each queue should have a channel to push to the queue through it

//     private constructor() {
//         this.producerChannels = new Map();
//         this.consumerChannels = new Map();
//     }

//     public static async getInstance(): Promise<RabbitMQ> {
//         if (!RabbitMQ.instance) {
//             RabbitMQ.instance = new RabbitMQ();
//             await RabbitMQ.instance.init();
//         }
//         return RabbitMQ.instance;
//     }

//     private async init(): Promise<void> {
//         try {
//             this.connection = await amqp.connect(this.url);
//             console.log('== RabbitMQ Connected ==');
//         } catch (error) {
//             console.error('RabbitMQ Connection Error:', error);
//         }
//     }

//     private async getConsumerChannel(queue: string): Promise<Channel> {
//         if (this.consumerChannels.has(queue)) {
//             return this.consumerChannels.get(queue)!;
//         }

//         const channel = await this.connection.createChannel();
//         await channel.assertQueue(queue, { durable: true }); // Ensures queue exists
//         this.consumerChannels.set(queue, channel); // Store the created channel

//         console.log(`Created channel for queue: ${queue}`);
//         return channel;
//     }

//     private async getProducerChannel(queue: string): Promise<Channel> {
//         if (this.producerChannels.has(queue)) {
//             return this.producerChannels.get(queue)!;
//         }

//         const channel = await this.connection.createChannel();
//         await channel.assertQueue(queue, { durable: true }); // Ensures queue exists
//         this.producerChannels.set(queue, channel); // Store the created channel

//         console.log(`Created channel for queue: ${queue}`);
//         return channel;
//     }

//     // public async sendToQueue(queue: string, message: any): Promise<void> {
//     //     const channel = await this.getProducerChannel(queue);
//     //     channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
//     //     console.log(`Message sent to ${queue}:`, message);
//     // }

//     public async consumeQueue(queue: string, callback: (msg: any) => void): Promise<void> {
//         const channel = await this.getConsumerChannel(queue);
//         await channel.consume(queue, async (msg) => {
//             if (msg) {
//                 const content = JSON.parse(msg.content.toString());
//                 await callback(content);
//                 channel.ack(msg);
//             }
//         });
//         console.log(`Consuming messages from ${queue}`);
//     }

//     public async sendTQueue(args: {
//         queue: 'billing_merchant',
//         msg: any
//     }){}

// }

class RabbitMQ {
    private static instance: RabbitMQ;
    private connection!: ChannelModel;
    // private readonly url = RABBITMQ_IP || "amqp://localhost";
    private mailChannel: Channel | null = null;
    private activeMerchantsChannel: Channel | null = null;



    public static async getInstance(): Promise<RabbitMQ> {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
            await RabbitMQ.instance.init();
        }
        return RabbitMQ.instance;
    }


    private async init(): Promise<void> {
        try {
            // init connection and channels
            // this.connection = await amqp.connect(this.url);
            this.connection = await amqp.connect({
                protocol: 'amqp', // or 'amqps' if using SSL
                hostname: RABBITMQ_IP || 'localhost', // or the IP address of your RabbitMQ container
                port: Number(RABBITMQ_PORT) || 5672,
                frameMax: 8192 // Ensure this is at least 8192
            });

            this.activeMerchantsChannel = await this.connection.createChannel();
            this.mailChannel = await this.connection.createChannel();

            // assert each queue to its channel
            await this.activeMerchantsChannel.assertQueue(ACTIVE_MERCHANTS!);
            await this.mailChannel.assertQueue(MAILS_QUEUE!)

            console.log('== RabbitMQ Connected ==');
        } catch (error) {
            console.error('RabbitMQ Connection Error:', error);
        }
    }

    public async sendMail(message: object) {
        await this.mailChannel?.sendToQueue(MAILS_QUEUE!, Buffer.from(JSON.stringify(message)))
    }

    public async pushActiveMerchant(context: MerchantAttributes) {
        await this.activeMerchantsChannel?.sendToQueue(ACTIVE_MERCHANTS!, Buffer.from(JSON.stringify(context)))
    }
}

export default RabbitMQ;