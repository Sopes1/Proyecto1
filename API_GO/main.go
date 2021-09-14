package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"reflect"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	URI = "mongodb://sopes1p1-2s2021:2E8TQCpXND5ca8PdKgWfG1uZGQq9LaeIrvKEDtZ0DVc4JJyCkFkfVkO3TurMlIB6TT6BphIiJRksDavsZhoeLw==@sopes1p1-2s2021.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@sopes1p1-2s2021@"
)

var client mongo.Client

type Data struct {
	Nombre     string   `json:"nombre"`
	Comentario string   `json:"comentario"`
	Fecha      string   `json:"fecha"`
	Hashtags   []string `json:"hashtags"`
	Upvotes    int      `json:"upvotes"`
	Downvotes  int      `json:"downvotes"`
}

type Response struct {
	Correct bool
}

func publicar(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	decoder := json.NewDecoder(req.Body)
	var data Data
	err := decoder.Decode(&data)
	if err != nil {
		panic(err)
	}
	log.Println(data)

	response := newData(data)

	json.NewEncoder(w).Encode(response)
}

func main() {
	//connection()
	router := mux.NewRouter()

	router.HandleFunc("/publicar", publicar).Methods("POST")

	log.Fatal(http.ListenAndServe(":3000", router))

}

func newData(data Data) bool {
	clientOptions := options.Client().ApplyURI(URI)
	fmt.Println("ClientOptopm TYPE:", reflect.TypeOf(clientOptions), "\n")

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() ERROR: ", err)
		return false
		os.Exit(1)
	}
	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)

	col := client.Database("Proyecto1Sopes").Collection("Comentarios")
	fmt.Println("Collection Type: ", reflect.TypeOf(col), "\n")

	fmt.Println("oneDoc Type: ", reflect.TypeOf(data), "\n")

	result, insertErr := col.InsertOne(ctx, data)
	if insertErr != nil {
		fmt.Println("InsertONE Error:", insertErr)
		return false
		os.Exit(1)
	} else {

		fmt.Println("InsertOne() result type: ", reflect.TypeOf(result))
		fmt.Println("InsertOne() api result type: ", result)

		newID := result.InsertedID
		fmt.Println("InsertedOne(), newID", newID)
		fmt.Println("InsertedOne(), newID type:", reflect.TypeOf(newID))
		return true

	}
	return false
}
