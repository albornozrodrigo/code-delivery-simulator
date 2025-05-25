package main

import (
	"fmt"
	route "github.com/albornozrodrigo/code-delivery-simulator/app/route"
	"github.com/albornozrodrigo/code-delivery-simulator/infra/kafka"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	producer := kafka.NewKafkaProducer()
	kafka.Publish("test", "read_test", producer)
	for {
		_ = 1
	}

	// route := route.Route {
	// 	ID: "1",
	// 	ClientID: "1",
	// }

	// route.LoadPositions()
	// stringjson, _ := route.ExportJsonPositions()
	// fmt.Println(stringjson[0])
}

