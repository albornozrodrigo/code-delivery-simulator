"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class KafkaConsumer {
    constructor() {
        this.messages = [];
        this.consumer = this.createKafkaConsumer();
    }
    createKafkaConsumer() {
        const kafka = new kafkajs_1.Kafka({
            brokers: [process.env.KAFKA_BROKER],
            clientId: process.env.KAFKA_CLIENT_ID
        });
        const consumer = kafka.consumer({
            groupId: process.env.KAFKA_CONSUMER_GROUP_ID
        });
        return consumer;
    }
    async consume(processMessage) {
        const topic = {
            topics: [process.env.KAFKA_READ_TOPIC],
            fromBeginning: true
        };
        await this.consumer.connect();
        await this.consumer.subscribe(topic);
        console.log('Consumer started, waiting for messages...');
        return await this.consumer.run({
            eachMessage: async (payload) => {
                const { topic, partition, message } = payload;
                console.log(`[Consumer] message received: ${message.value?.toString() || 'null'}`);
                processMessage(message);
            },
        });
    }
}
exports.default = KafkaConsumer;
