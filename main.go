package main

import (
	"fmt"
	// route "github.com/albornozrodrigo/code-delivery-simulator/app/route"
	ckafka "github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/albornozrodrigo/code-delivery-simulator/infra/kafka"
	kafkaP "github.com/albornozrodrigo/code-delivery-simulator/app/kafka"
	"github.com/joho/godotenv"
	"log"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()

	for msg := range msgChan {
		fmt.Printf("Received message: %s\n", string(msg.Value))
		go kafkaP.Produce(msg)
	}

	// producer := kafka.NewKafkaProducer()
	// kafka.Publish("test", "readtest", producer)
	
	// for {
	// 	_ = 1
	// }

	// route := route.Route {
	// 	ID: "1",
	// 	ClientID: "1",
	// }

	// route.LoadPositions()
	// stringjson, _ := route.ExportJsonPositions()
	// fmt.Println(stringjson[0])
}

