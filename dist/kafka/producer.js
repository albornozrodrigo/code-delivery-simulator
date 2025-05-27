"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const dotenv_1 = __importDefault(require("dotenv"));
const route_1 = __importDefault(require("../route"));
dotenv_1.default.config();
class KafkaProducer {
    constructor() {
        this.producer = this.createProducer();
    }
    createProducer() {
        const kafka = new kafkajs_1.Kafka({
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER],
        });
        return kafka.producer({
            createPartitioner: kafkajs_1.Partitioners.LegacyPartitioner
        });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async loadAndPublish(message) {
        await this.producer.connect();
        if (!message.value) {
            throw new Error("KafkaMessage value is null or undefined");
        }
        const payload = JSON.parse(message.value.toString());
        const route = new route_1.default(payload.clientId, payload.routeId);
        route.loadPositions();
        const positions = route.exportJsonPositions();
        for (const position of positions) {
            await this.publish(position, process.env.KAFKA_PRODUCE_TOPIC);
            await this.sleep(500); // 500ms entre envios
        }
        await this.producer.disconnect();
    }
    async publish(msg, topic) {
        await this.producer.send({
            topic,
            messages: [{ value: msg }],
        });
    }
}
exports.default = KafkaProducer;
