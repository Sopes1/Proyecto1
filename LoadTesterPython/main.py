# This is a sample Python script.

# Press Mayús+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import json
import random
import requests

mydata={}

def showPrincipal():
    print("###############-LOAD TESTER-###############")
    print("1. Cargar Archivo")
    print("2. Enviar Tráfico")
    print("3. Leer Archivo")
    print("4. Salir")

    res=int(input("Ingrese la opcion: "))

    if res == 1:
        print("\033[H\033[2J")
        cargarArchivo()
        showPrincipal()
    elif res == 2:
        print("\033[H\033[2J")
        showSelectApi()
    elif res == 3:
        showPrincipal()
    elif res == 4:
        return
    else:
        print("\033[H\033[2J")
        showPrincipal()

def cargarArchivo():
    global mydata
    nombreArchivo = input("Ingrese el nombre del archivo: ")
    try:
        with open(nombreArchivo) as file:
            mydata = json.load(file)
            print(mydata)

    except:
        print("Error al cargar el archivo")
        return
    print("archivo cargado exitosamente")
    continuar = input("presione cualquier tecla para continuar: ")

def showSelectApi():
    print("###############-Seleccionar Api-############")
    print("1. Python")
    print("2. Golang")
    print("3. Rust")
    print("4. Regresar")

    res = int(input("Ingrese la opcion: "))
    if res == 1:
        print("\033[H\033[2J")
        EnviarTrafico(1)
        showSelectApi()
    elif res == 2:
        print("\033[H\033[2J")
        #EnviarTrafico(2)
        print("\033[H\033[2J")
        showSelectApi()
    elif res == 3:
        print("\033[H\033[2J")
        #EnviarTrafico(3)
        print("\033[H\033[2J")
        showSelectApi()
    elif res == 4:
        print("\033[H\033[2J")
        showPrincipal()
    else:
        print("\033[H\033[2J")
        showSelectApi()

def EnviarTrafico(api):
    host = "http://localhost"
    port = ":5000"
    url=""
    if api == 1:
        url = host + port + "/python/publicar"
    elif api == 2:
        url = host + port + "/golang/publicar"
    elif api==3:
        url = host + port + "/rust/publicar"
    jsonData = []
    cantidadArchivos = int(input("Cantidad de archivos a enviar: "))
    for i in range(cantidadArchivos):
        jsonData.append(mydata[random.randrange(0, len(mydata))])
    print(jsonData)
    print("Enviando a Mysql")
    print(url)
    headers = {"Content-Type": "application/json"}
    response = requests.post(url+"/mysql", data=json.dumps(jsonData), headers=headers)
    respuesta = response.json()
    print("=============Datos Mysql=============")
    print("BD: ")
    print(respuesta["BD"])
    print("Correctos: ")
    print(respuesta["Correctos"])
    print("Incorrectos: ")
    print(respuesta["Incorrectos"])
    print("Tiempo: ")
    print(respuesta["Tiempo"])
    print("=====================================")
    print("Enviando a MongoDb")
    print(url)
    headers = {"Content-Type": "application/json"}
    response = requests.post(url + "/mongodb", data=json.dumps(jsonData), headers=headers)
    respuesta = response.json()
    print("=============Datos MongoDb=============")
    print("BD: ")
    print(respuesta["BD"])
    print("Correctos: ")
    print(respuesta["Correctos"])
    print("Incorrectos: ")
    print(respuesta["Incorrectos"])
    print("Tiempo: ")
    print(respuesta["Tiempo"])
    print("=====================================")

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    showPrincipal()

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
