package main

import (
	"C"
	"bufio"
	"fmt"
	"os"
	"strings"
)
import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"
)

const (
	host = "http://localhost"
	port = ":3000"
)

type Comentarios struct {
	Comentarios []Data `json:"comentarios"`
}

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

var reader = bufio.NewReader(os.Stdin)

var comentarios []Data

func main() {
	showPrincipal()
}

func showPrincipal() {
	fmt.Println("###############-LOAD TESTER-###############")
	fmt.Println("1. Cargar Archivo")
	fmt.Println("2. Enviar Tráfico")
	fmt.Println("3. Leer Archivo")
	fmt.Println("4. Salir")

	res, _ := reader.ReadString('\n')

	switch strings.TrimSpace(res) {
	case "1":
		fmt.Print("\033[H\033[2J")
		cargarArchivo()
		showPrincipal()
		break
	case "2":
		fmt.Print("\033[H\033[2J")
		if comentarios != nil {
			showSelectApi()
		} else {
			fmt.Print("No se ha cargado ningun archivo")
			reader.ReadString('\n')
		}
		showPrincipal()
		break
	case "3":
		printFile()
		showPrincipal()
		return
	case "4":
		return
	default:
		fmt.Print("\033[H\033[2J")
		showPrincipal()
	}
}

func showSelectApi() {
	fmt.Println("###############-Seleccionar Api-############")
	fmt.Println("1. Python")
	fmt.Println("2. Golang")
	fmt.Println("3. Rust")
	fmt.Println("4. Regresar")

	res, _ := reader.ReadString('\n')

	switch strings.TrimSpace(res) {
	case "1":
		fmt.Print("\033[H\033[2J")
		EnviarTrafico(1)
		showSelectApi()
		break
	case "2":
		fmt.Print("\033[H\033[2J")
		EnviarTrafico(2)
		fmt.Print("\033[H\033[2J")
		showSelectApi()
		break
	case "3":
		fmt.Print("\033[H\033[2J")
		EnviarTrafico(3)
		reader.ReadLine()
		showSelectApi()
		break
	case "4":
		fmt.Print("\033[H\033[2J")
		showPrincipal()
	default:
		fmt.Print("\033[H\033[2J")
		showSelectApi()
	}

}

func cargarArchivo() {
	fmt.Print("Nombre Archivo: ")
	res, _ := reader.ReadString('\n')

	res = strings.TrimSpace(res)

	//res := "prueba2.json"

	jsonFile, err := os.Open(res)

	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Archivo Aceptado")
	}

	fmt.Println("Presione enter para continuar...")
	reader.ReadLine()
	defer jsonFile.Close()

	byteValue, _ := ioutil.ReadAll(jsonFile)
	json.Unmarshal(byteValue, &comentarios)

}

func EnviarTrafico(api int) {

	/*/
	api = 1 = Python
	api = 2 = Golang
	api = 3 = Rust
	*/

	var url string

	switch api {
	case 1:
		url = host + port + "/python/publicar"
		break
	case 2:
		url = host + port + "/golang/publicar"
		break
	case 3:
		url = host + port + "/rust/publicar"

	}

	// var jsonData []Data

	// fmt.Print("Cantidad De Archivos A Enviar: ")
	// var nDatos int
	// fmt.Scanf("%d", &nDatos)*/

	// rand.Seed(time.Now().UnixNano())
	// for i := 0; i < nDatos; i++ {
	// 	jsonData = append(jsonData, comentarios[rand.Intn(len(comentarios))])
	// }

	var bodyMysql, bodyMongo RequestInfo

	fmt.Println("Enviando Data A Mysql")
	responseMysql := sendJsonData("/mysql", comentarios, url)
	json.Unmarshal(responseMysql, &bodyMysql)
	fmt.Println("=============Datos Mysql=============")
	fmt.Print("BD: ")
	fmt.Println(bodyMysql.Nombre)
	fmt.Print("Correctos: ")
	fmt.Println(bodyMysql.Correctos)
	fmt.Print("Incorrectos: ")
	fmt.Println(bodyMysql.Incorrectos)
	fmt.Print("Tiempo: ")
	fmt.Println(bodyMysql.Tiempo)
	fmt.Println("=====================================")

	fmt.Println("Enviando Data A Mongo")
	responseMongo := sendJsonData("/mongo", comentarios, url)
	json.Unmarshal(responseMongo, &bodyMongo)
	fmt.Println("=============Datos Mongo=============")
	fmt.Print("BD: ")
	fmt.Println(bodyMongo.Nombre)
	fmt.Print("Correctos: ")
	fmt.Println(bodyMongo.Correctos)
	fmt.Print("Incorrectos: ")
	fmt.Println(bodyMongo.Incorrectos)
	fmt.Print("Tiempo: ")
	fmt.Println(bodyMongo.Tiempo)
	fmt.Println("=====================================")
	fmt.Print("Enter para continuar......")
	reader.ReadLine()

}

//Para mostrar el archivo json
func printFile() {
	fmt.Println("Imprimiendo Comentario")
	for i := 0; i < len(comentarios); i++ {

		var hashtags string

		for index, hashtag := range comentarios[i].Hashtags {
			if index != 0 {
				hashtags = hashtags + "," + hashtag
			} else {
				hashtags = hashtag
			}

		}

		fmt.Println("-------------------------------------------")
		fmt.Println("Nombre: " + comentarios[i].Nombre)
		fmt.Println("Comentario: " + comentarios[i].Comentario)
		fmt.Println("Fecha: " + comentarios[i].Fecha)
		fmt.Println("Hashtags: " + hashtags)
		fmt.Println("Upvotes: " + strconv.Itoa(comentarios[i].Upvotes))
		fmt.Println("Downvotes: " + strconv.Itoa(comentarios[i].Downvotes))
	}
	fmt.Println("Presione enter para continuar...")
	reader.ReadLine()
}

func sendJsonData(db string, d []Data, url string) []byte {
	dat, _ := json.Marshal(d)
	responseBody := bytes.NewBuffer(dat)

	req, errMongo := http.Post(url+db, "application/json", responseBody)
	if errMongo != nil {
		fmt.Print("Error en peticion ")
		fmt.Println(errMongo)
		return nil
	} else {
		defer req.Body.Close()
		body, err := ioutil.ReadAll(req.Body)
		if err != nil {
			fmt.Print("Error: ")
			fmt.Println(err)
			return nil
		}
		//fmt.Println("Body " + db + ": \n" + string(body))
		return body
	}

}
