package kafka

import ckafka "github.com/confluentinc/confluent-kafka-go/kafka"

func NewKafkaProducer() *ckafka.Producer {
	return &*ckafka.configMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
	}

	p, err := ckafka.NewProducer(configMap)
	
	if err != nil {
		log.Println("Error creating producer: %v", err.Error())
	}

	return p
}

func Publish(msg string, topic string, producer *ckafka.Producer) error {
	message := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{Topic: &topic, Partition: ckafka.PartitionAny},
		Value:          []byte(msg),
	}

	err := producer.Produce(message, deliveryChan)
	if err != nil {
		return err
	}

	return nil
}