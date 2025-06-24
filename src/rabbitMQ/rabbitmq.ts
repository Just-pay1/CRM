import amqp, { Channel, ChannelModel, ConsumeMessage } from "amqplib";
import { ACTIVE_MERCHANTS, RABBITMQ_IP, MAILS_QUEUE, RABBITMQ_PORT, RABBITMQ_PASSWORD, RABBITMQ_USERNAME, MERCHANT_USERS_QUEUE, REF_NUMBER_ACTIVE_MERCHANTS_QUEUE, WALLET_ACTIVE_MERCHANTS_QUEUE } from "../config";
import { EmailRequest, MerchantAttributes, MerchantUsers } from "../utilities/common-interfaces";

class RabbitMQ {
    private static instance: RabbitMQ;
    private connection!: ChannelModel;
    // private readonly url = RABBITMQ_IP || "amqp://localhost";
    private mailChannel: Channel | null = null;
    private activeMerchantsChannel: Channel | null = null;
    private merchantUsersChannel: Channel | null = null;



    public static async getInstance(): Promise<RabbitMQ> {
        if (!RabbitMQ.instance) {
            RabbitMQ.instance = new RabbitMQ();
            await RabbitMQ.instance.init();
        }
        return RabbitMQ.instance;
    }


    private async init(): Promise<void> {
        try {
            this.connection = await amqp.connect({
                protocol: 'amqps',
                hostname: RABBITMQ_IP || 'localhost',
                port: Number(RABBITMQ_PORT) || 5672,
                username: RABBITMQ_USERNAME,
                password: RABBITMQ_PASSWORD,
                vhost: RABBITMQ_USERNAME,
                frameMax: 8192 // Ensure this is at least 8192
            });

            this.activeMerchantsChannel = await this.connection.createChannel();
            this.mailChannel = await this.connection.createChannel();
            this.merchantUsersChannel = await this.connection.createChannel();

            // await this.activeMerchantsChannel.assertExchange('broadcastMerchantsExchange', 'fanout', {
            //     durable: true
            // });

            // assert each queue to its channel
            await this.activeMerchantsChannel.assertQueue(ACTIVE_MERCHANTS!);
            await this.activeMerchantsChannel.assertQueue(REF_NUMBER_ACTIVE_MERCHANTS_QUEUE!);
            await this.activeMerchantsChannel.assertQueue(WALLET_ACTIVE_MERCHANTS_QUEUE!, { durable: false });
            await this.mailChannel.assertQueue(MAILS_QUEUE!)
            await this.merchantUsersChannel.assertQueue(MERCHANT_USERS_QUEUE!)

            // await this.activeMerchantsChannel.bindQueue(ACTIVE_MERCHANTS!, 'broadcastMerchantsExchange', '');
            // await this.activeMerchantsChannel.bindQueue(REF_NUMBER_ACTIVE_MERCHANTS_QUEUE!, 'broadcastMerchantsExchange', '');
            // await this.activeMerchantsChannel.bindQueue(WALLET_ACTIVE_MERCHANTS_QUEUE!, 'broadcastMerchantsExchange', '');


            console.log('== RabbitMQ Connected ==');
        } catch (error) {
            console.error('RabbitMQ Connection Error:', error);
        }
    }

    public sendMail(message: EmailRequest) {
        this.mailChannel?.sendToQueue(MAILS_QUEUE!, Buffer.from(JSON.stringify(message)))
        console.log('mail sent');
    }

    // public pushActiveMerchant(context: MerchantAttributes) {
    //     // this.activeMerchantsChannel?.sendToQueue(ACTIVE_MERCHANTS!, Buffer.from(JSON.stringify(context)))
    //     // console.log(`added to the ${ACTIVE_MERCHANTS}`)
    //     // this.activeMerchantsChannel?.sendToQueue(REF_NUMBER_ACTIVE_MERCHANTS_QUEUE!, Buffer.from(JSON.stringify(context)))
    //     // console.log(`added to the ${REF_NUMBER_ACTIVE_MERCHANTS_QUEUE}`)
    //     this.activeMerchantsChannel?.publish('broadcastMerchantsExchange', '', Buffer.from(JSON.stringify(context)));
    //     const userId = context.merchant_id;
    //     this.activeMerchantsChannel?.sendToQueue(WALLET_ACTIVE_MERCHANTS_QUEUE!, Buffer.from(JSON.stringify({userId})))
    // }

    public pushActiveMerchantToReferenceNum (context: MerchantAttributes) {
        const userId = context.merchant_id;
        this.activeMerchantsChannel?.sendToQueue(REF_NUMBER_ACTIVE_MERCHANTS_QUEUE!, Buffer.from(JSON.stringify(context)))
        this.activeMerchantsChannel?.sendToQueue(WALLET_ACTIVE_MERCHANTS_QUEUE!, Buffer.from(JSON.stringify({userId})))
    }

    public pushActiveMerchantToBilling (context: MerchantAttributes) {
        const userId = context.merchant_id;
        this.activeMerchantsChannel?.sendToQueue(ACTIVE_MERCHANTS!, Buffer.from(JSON.stringify(context)))
        this.activeMerchantsChannel?.sendToQueue(WALLET_ACTIVE_MERCHANTS_QUEUE!, Buffer.from(JSON.stringify({userId})))
    }

}

export default RabbitMQ;