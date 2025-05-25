package kafka

import (
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
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

func (l *KafkaConsumer) Consume() {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
		"group.id":          os.Getenv("KAFKA_CONSUMER_GROUP_ID"),
	}

	c, err := ckafka.NewConsumer(configMap)
	if err != nil {
		log.Fatalf("Error creating consumer: %v", err.Error())
	}

	topics := []string{os.Getenv("KAFKA_TOPIC")}
	c.SubscribeTopics(topics, nil)
	fmt.Println("Consumer started, waiting for messages...")
	for {
		msg, err := c.ReadMessage(-1)

		if err == nil {
			k.MsgChan <- msg
		}
	}
}