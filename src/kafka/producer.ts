import { Kafka, KafkaMessage, Partitioners, Producer } from 'kafkajs';
import dotenv from 'dotenv';
import Route from '../route';

dotenv.config();

export default class KafkaProducer {
  private producer: Producer;

  constructor() {
    this.producer = this.createProducer();
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID!,
      brokers: [process.env.KAFKA_BROKER!],
    })

    return kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner
    });
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async loadAndPublish(message: KafkaMessage) {
    await this.producer.connect();

    if (!message.value) {
      throw new Error("KafkaMessage value is null or undefined");
    }

    const payload = JSON.parse(message.value.toString());
    const route = new Route(payload.clientId, payload.routeId);
    route.loadPositions();
    const positions = route.exportJsonPositions();

    for (const position of positions) {
      await this.publish(position, process.env.KAFKA_PRODUCE_TOPIC!);
      await this.sleep(500);  // 500ms entre envios
    }

    await this.producer.disconnect();
  }

  async publish(msg: string, topic: string) {
    await this.producer.send({
      topic,
      messages: [{ value: msg }],
    });
  }
}
