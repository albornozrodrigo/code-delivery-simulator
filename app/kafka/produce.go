package kafka

import (
	"os"
	"log"
	"time"
	"encoding/json"
	ckafka "github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/albornozrodrigo/code-delivery-simulator/app/route"
	"github.com/albornozrodrigo/code-delivery-simulator/infra/kafka"
)

func Produce(msg *ckafka.Message) {
	producer := kafka.NewKafkaProducer()
	route := NewRoute()
	json.Unmarshal(msg.Value, &route)
	route.LoadPositions()
	positions, err := route.ExportJsonPositions()

	if err != nil {
		log.Println("Error exporting positions to JSON:", err)
	}

	for _, position := range positions {
		kafka.Publish(position, os.Getenv("KafkaProduceTopic"), producer)
		time.Sleep(time.Millisecond * 500)
	}
}
