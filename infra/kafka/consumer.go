package kafka

import (
	ckafka "github.com/confluentinc/confluent-kafka-go/v2/kafka"
	// ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"fmt"
	"log"
	"os"
)

type KafkaConsumer struct {
	MsgChan chan *ckafka.Message
}

func NewKafkaConsumer(msgChan chan *ckafka.Message) *KafkaConsumer {
	return &KafkaConsumer{
		MsgChan: msgChan,
	}
}

func (k *KafkaConsumer) Consume() {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KafkaBootstrapServers"),
		"group.id":          os.Getenv("KafkaConsumerGroupId"),
	}

	c, err := ckafka.NewConsumer(configMap)
	if err != nil {
		log.Fatalf("Error creating consumer: %v", err.Error())
	}

	topics := []string{os.Getenv("KafkaReadTopic")}
	c.SubscribeTopics(topics, nil)
	fmt.Println("Consumer started, waiting for messages...")
	for {
		msg, err := c.ReadMessage(-1)

		if err == nil {
			k.MsgChan <- msg
		}
	}
}
