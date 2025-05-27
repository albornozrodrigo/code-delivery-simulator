import { Consumer, EachMessagePayload, Kafka, KafkaMessage } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

export default class KafkaConsumer {
  private consumer: Consumer;
  private messages: KafkaMessage[] = [];

  constructor() {
    this.consumer = this.createKafkaConsumer()
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER!],
      clientId: process.env.KAFKA_CLIENT_ID!
    });

    const consumer = kafka.consumer({
      groupId: process.env.KAFKA_CONSUMER_GROUP_ID!
    });

    return consumer
  }

  async consume(processMessage: (msg: KafkaMessage) => Promise<void>) {
    const topic = {
      topics: [process.env.KAFKA_READ_TOPIC!],
      fromBeginning: true
    };

    await this.consumer.connect();
    await this.consumer.subscribe(topic);

    console.log('Consumer started, waiting for messages...');

    return await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log(`[Consumer] message received: ${message.value?.toString() || 'null'}`);
        processMessage(message);
      },
    });
  }
}
