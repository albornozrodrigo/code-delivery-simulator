package main

// import route "github.com/albornozrodrigo/code-delivery-simulator"

func main() {
	route := route.Route {
		ID: "1",
		ClientID: "1",
	}

	route.LoadPositions()
	stringjson, _ := route.ExportJsonPositions()
	fmt.Println(stringjson[0])
}