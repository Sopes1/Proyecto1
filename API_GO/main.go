package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"

	//MONGO

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	//MySQL
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

//URL para conexion a mongo
const (
	URI = "mongodb://sopes1p1-2s2021:2E8TQCpXND5ca8PdKgWfG1uZGQq9LaeIrvKEDtZ0DVc4JJyCkFkfVkO3TurMlIB6TT6BphIiJRksDavsZhoeLw==@sopes1p1-2s2021.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@sopes1p1-2s2021@"
)

var client mongo.Client

//Struct de la data del comentario
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

func publicarMysql(w http.ResponseWriter, req *http.Request) {
	//Devolver en formato json
	w.Header().Set("Content-Type", "application/json")
	//Decodificar el body
	decoder := json.NewDecoder(req.Body)
	var data Data
	//Asignar la data del body al struct data
	err := decoder.Decode(&data)
	if err != nil {
		panic(err)
	}
	log.Println(data)
	//Se ingreso correctamente a la base de datos?
	response := newDataMySQL(data)
	//Response
	json.NewEncoder(w).Encode(response)
}

func publicarMongo(w http.ResponseWriter, req *http.Request) {
	//Devolver en formato json
	w.Header().Set("Content-Type", "application/json")
	//Decodificar el body
	decoder := json.NewDecoder(req.Body)
	var data Data
	//Asignar la data del body al struct data
	err := decoder.Decode(&data)
	if err != nil {
		panic(err)
	}
	log.Println(data)
	//Se ingreso correctamente a la base de datos?
	response := newDataMongo(data)
	//Response
	json.NewEncoder(w).Encode(response)
}

func main() {

	router := mux.NewRouter()

	//Ruta para insertar en mongo
	router.HandleFunc("/publicar/Mongo", publicarMongo).Methods("POST")
	//Ruta para insertar en mysql
	router.HandleFunc("/publicar/Mysql", publicarMysql).Methods("POST")

	//Iniciando API
	log.Fatal(http.ListenAndServe(":3000", router))

}

//Si la funcion logra ingresar data devielve true, de lo contrario devuelve false
func newDataMongo(data Data) bool {
	clientOptions := options.Client().ApplyURI(URI)
	fmt.Println("ClientOptopm TYPE:", reflect.TypeOf(clientOptions))

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() ERROR: ", err)
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)

	col := client.Database("Proyecto1Sopes").Collection("Comentarios")
	fmt.Println("Collection Type: ", reflect.TypeOf(col))

	fmt.Println("oneDoc Type: ", reflect.TypeOf(data))

	result, insertErr := col.InsertOne(ctx, data)
	if insertErr != nil {
		fmt.Println("InsertONE Error:", insertErr)
		defer cancel()
		return false
	} else {

		fmt.Println("InsertOne() result type: ", reflect.TypeOf(result))
		fmt.Println("InsertOne() api result type: ", result)

		newID := result.InsertedID
		fmt.Println("InsertedOne(), newID", newID)
		fmt.Println("InsertedOne(), newID type:", reflect.TypeOf(newID))
		defer cancel()
		return true

	}
}

//Si la funcion logra ingresar data devielve true, de lo contrario devuelve false
func newDataMySQL(data Data) bool {

	db, err := sql.Open("mysql", "root:1234@tcp(104.198.201.11:3306)/sopesP1")

	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	defer db.Close()

	var nFecha = strings.Replace(data.Fecha, "/", "-", 2)
	var nHashtags string

	for index, hashtag := range data.Hashtags {
		if index != 0 {
			nHashtags = nHashtags + "," + hashtag
		} else {
			nHashtags = hashtag
		}

	}

	insert, err := db.Query(`INSERT INTO comentario(nombre_comentario, comentario, hashtag, fecha_comentario, upvotes_comentario, down_comentario)
							VALUES ('` + data.Nombre + `','` + data.Comentario + `','` + nHashtags + `',STR_TO_DATE('` + nFecha + `', '%d-%m-%Y'),` + strconv.Itoa(data.Downvotes) + `,` + strconv.Itoa(data.Upvotes) + `)`)

	if err != nil {
		fmt.Println(err.Error())
		return false
	}
	defer insert.Close()
	return true
}
