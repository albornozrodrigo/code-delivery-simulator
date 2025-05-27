import dotenv from "dotenv";
import KafkaConsumer from "./kafka/consumer";
import KafkaProducer from "./kafka/producer";
import { KafkaMessage } from "kafkajs";

dotenv.config();

const consumer = new KafkaConsumer();
const producer = new KafkaProducer();

async function consumeAndProduce() {
  await consumer.consume(async (message: KafkaMessage) => {
    console.log(`Received message: ${message.value?.toString() || 'null'}`);
    await producer.loadAndPublish(message);
  });
}

consumeAndProduce().catch((e: any) => {
  console.error(`Error in consumer/producer: ${e.message}`, e);
  process.exit(1);
});
