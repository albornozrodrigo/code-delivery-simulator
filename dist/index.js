"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const consumer_1 = __importDefault(require("./kafka/consumer"));
const producer_1 = __importDefault(require("./kafka/producer"));
dotenv_1.default.config();
const consumer = new consumer_1.default();
const producer = new producer_1.default();
async function consumeAndProduce() {
    await consumer.consume(async (message) => {
        console.log(`Received message: ${message.value?.toString() || 'null'}`);
        await producer.loadAndPublish(message);
    });
}
consumeAndProduce().catch((e) => {
    console.error(`Error in consumer/producer: ${e.message}`, e);
    process.exit(1);
});
