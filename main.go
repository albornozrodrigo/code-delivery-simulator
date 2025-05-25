package main

import (
	"fmt"
	route "github.com/albornozrodrigo/code-delivery-simulator/app/route"
)

func main() {
	route := route.Route {
		ID: "1",
		ClientID: "1",
	}

	route.LoadPositions()
	stringjson, _ := route.ExportJsonPositions()
	fmt.Println(stringjson[0])
}
