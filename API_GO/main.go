package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

	// Leer variables de entorno
	"github.com/joho/godotenv"
	// Libreria de Google PubSub
	"cloud.google.com/go/pubsub"
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

type RequestInfo struct {
	Nombre      string  //Nombre de la base de datos de donde es la informacion
	Correctos   int     //Numero de peticiones correctas
	Incorrectos int     //Numero de peticiones incorrectas
	Tiempo      float64 //Tiempo que tardo en ejecutarse la peticion
}

type Publisher struct {
	Guardados int
	Api       string
	Tiempo    float64
	BD        string
}

func main() {

	router := mux.NewRouter()
	//Ruta para insertar en mysql
	router.HandleFunc("/golang/publicar/mysql", insertDataMysql).Methods("POST")
	//Ruta para insertar en mongo
	router.HandleFunc("/golang/publicar/mongo", insertDataMongo).Methods("POST")
	//Iniciando API
	log.Fatal(http.ListenAndServe(":3000", router))

}

func goDotEnvVariable(key string) string {

	// Leer el archivo .env ubicado en la carpeta actual
	err := godotenv.Load(".env")

	// Si existio error leyendo el archivo
	if err != nil {
		log.Fatalf("Error cargando las variables de entorno")
	}

	// Enviar la variable de entorno que se necesita leer
	return os.Getenv(key)
}

func publish(msg string) error {
	// Definimos el ProjectID del proyecto
	// Este dato lo sacamos de Google Cloud
	projectID := goDotEnvVariable("PROJECT_ID")

	// Definimos el TopicId del proyecto
	// Este dato lo sacamos de Google Cloud
	topicID := goDotEnvVariable("TOPIC_ID")

	// Definimos el contexto en el que ejecutaremos PubSub
	ctx := context.Background()
	// Creamos un nuevo cliente
	client, err := pubsub.NewClient(ctx, projectID)
	// Si un error ocurrio creando el nuevo cliente, entonces imprimimos un error y salimos
	if err != nil {
		fmt.Println("error")
		return fmt.Errorf("pubsub.NewClient: %v", err)
	}

	// Obtenemos el topico al que queremos enviar el mensaje
	t := client.Topic(topicID)

	// Publicamos los datos del mensaje
	result := t.Publish(ctx, &pubsub.Message{Data: []byte(msg)})

	// Bloquear el contexto hasta que se tenga una respuesta de parte de GooglePubSub
	id, err := result.Get(ctx)

	// Si hubo un error creando el mensaje, entonces mostrar que existio un error
	if err != nil {
		fmt.Println("error:")
		fmt.Println(err)
		return fmt.Errorf("Error: %v", err)
	}

	// El mensaje fue publicado correctamente
	fmt.Println("Published a message; msg ID: %v\n", id)
	return nil
}

//Si la funcion logra ingresar data devielve true, de lo contrario devuelve false
func newDataMongo(data Data) bool {
	clientOptions := options.Client().ApplyURI(URI)

	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println("Mongo.connect() ERROR: ", err)
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	col := client.Database("Proyecto1Sopes").Collection("Comentarios")

	_, insertErr := col.InsertOne(ctx, data)
	if insertErr != nil {
		fmt.Println("InsertONE Error:", insertErr)
		defer cancel()
		return false
	} else {
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

	insert, err := db.Query(`INSERT INTO comentarios(nombre_comentario, comentario, hashtag, fecha_comentario, upvotes_comentario, down_comentario)
							VALUES ('` + data.Nombre + `','` + data.Comentario + `','` + nHashtags + `',STR_TO_DATE('` + nFecha + `', '%d-%m-%Y'),` + strconv.Itoa(data.Upvotes) + `,` + strconv.Itoa(data.Downvotes) + `)`)

	if err != nil {
		fmt.Print(insert)
		fmt.Println(err.Error())
		return false
	}
	defer insert.Close()
	return true
}

//Manda todas las peticiones a la base de datos Mysql
func insertDataMysql(w http.ResponseWriter, req *http.Request) /*RequestInfo*/ {
	fmt.Println("Insertando Data En Mysql")

	var correctos int
	var incorrectos int
	var dato []Data

	//Devolver en formato json
	w.Header().Set("Content-Type", "application/json")
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&dato)

	if err != nil {
		panic(err)
	}

	start := time.Now()

	for _, data := range dato {
		response := newDataMySQL(data)

		if response == true {
			correctos = correctos + 1
		} else {
			incorrectos = incorrectos + 1
		}
	}
	tiempo := time.Since(start).Seconds()
	publish("{guardados: " + strconv.Itoa(correctos) + ", api: 'golang', tiempoDeCarga: " + fmt.Sprint(tiempo) + ", bd: 'MySQL'}")
	fmt.Println("Termina Mysql")
	//return RequestInfo{Correctos: correctos, Incorrectos: incorrectos, Tiempo: time.Since(start).Seconds()}
	json.NewEncoder(w).Encode(RequestInfo{Correctos: correctos, Incorrectos: incorrectos, Tiempo: time.Since(start).Seconds()})
}

//Manda todas las peticiones a la base de datos Mongo
func insertDataMongo(w http.ResponseWriter, req *http.Request) /*RequestInfo*/ {
	fmt.Println("Insertando Data en Mongo")
	var correctos int
	var incorrectos int
	var dato []Data

	//Devolver en formato json
	w.Header().Set("Content-Type", "application/json")
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&dato)

	if err != nil {
		panic(err)
	}

	start := time.Now()

	for _, data := range dato {
		response := newDataMongo(data)

		if response == true {
			correctos = correctos + 1
		} else {
			incorrectos = incorrectos + 1
		}
	}
	tiempo := time.Since(start).Seconds()
	publish("{guardados: " + strconv.Itoa(correctos) + ", api: 'golang', tiempoDeCarga: " + fmt.Sprint(tiempo) + ", bd: 'CosmosDB'}")
	fmt.Println("Termina Mongo")
	//return RequestInfo{Correctos: correctos, Incorrectos: incorrectos, Tiempo: time.Since(start).Seconds()}
	json.NewEncoder(w).Encode(RequestInfo{Correctos: correctos, Incorrectos: incorrectos, Tiempo: tiempo})
}
