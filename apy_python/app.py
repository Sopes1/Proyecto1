from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from pymongo import MongoClient
import os
import json
from google.cloud import pubsub_v1
from concurrent.futures import TimeoutError
import time


os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="key.json"
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:1234@104.198.201.11/sopesP1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)

# Pub/Sub consumer timeout
timeout = 3.0
# GCP topic, project & subscription ids
PUB_SUB_TOPIC = "sopesp1"
PUB_SUB_PROJECT = "abiding-circle-325403"

connection_uri = f"mongodb://sopes1p1-2s2021:2E8TQCpXND5ca8PdKgWfG1uZGQq9LaeIrvKEDtZ0DVc4JJyCkFkfVkO3TurMlIB6TT6BphIiJRksDavsZhoeLw==@sopes1p1-2s2021.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@sopes1p1-2s2021@"
client = MongoClient(connection_uri)
db_name = "Proyecto1Sopes"
dbMongo = client[db_name]
comentarios_collection = dbMongo['Comentarios']
def process_payload(message):
    print(f"Received {message.data}.")
    message.ack()

# producer function to push a message to a topic
def push_payload(payload, topic, project):
        publisher = pubsub_v1.PublisherClient()
        topic_path = publisher.topic_path(project, topic)
        data = json.dumps(payload).encode("utf-8")
        future = publisher.publish(topic_path, data=data)
        print("Pushed message to topic.")

class comentarios(db.Model):
    id_comentario = db.Column(db.Integer, primary_key=True)
    nombre_comentario = db.Column(db.String(100), nullable=True)
    comentario = db.Column(db.String(250), nullable=True)
    hashtag = db.Column(db.String(300), nullable=True)
    fecha_comentario = db.Column(db.String(250), nullable=True)
    upvotes_comentario = db.Column(db.Integer, nullable=True)
    down_comentario = db.Column(db.Integer, nullable=True)

    def __init__(self, nombre, comentario, hashtags, fecha, upvotes, downvotes):
        self.nombre_comentario = nombre
        self.comentario = comentario
        self.hashtag = hashtags
        self.fecha_comentario = fecha
        self.upvotes_comentario = upvotes
        self.down_comentario = downvotes

@app.route('/python/publicar/mysql', methods=['POST'])
def insert_mysql():  # put application's code here
    comentariosVec = request.get_json()
    correctos = 0
    incorrectos = 0
    inicio = time.time()
    for comentario in comentariosVec:
        hashtags = " "
        if comentario["hashtags"] is None:
            hashtags = " "
        else:
            hashtags = ','.join(comentario["hashtags"])
        fechaVec = comentario["fecha"].split("/")
        fecha = fechaVec[2]+"-"+fechaVec[1]+"-"+fechaVec[0]
        new_comment = comentarios(comentario["nombre"], comentario["comentario"],hashtags,fecha,comentario["upvotes"],comentario["downvotes"])
        try:
            db.session.add(new_comment)
            db.session.commit()
            correctos = correctos+1
        except:
            incorrectos = incorrectos+1
    print("===================================")
    fin = time.time()
    tiempoTotal = round(fin-inicio, 2)
    payload = {"guardados": correctos, "api": "python", "TiempoDeCarga":tiempoTotal, "bd":"Mysql"}
    print(f"Sending payload: {payload}.")
    push_payload(payload, PUB_SUB_TOPIC, PUB_SUB_PROJECT)
    return '''
              '''

@app.route('/python/publicar/mongodb', methods=['POST'])
def insert_mongodb():  # put application's code here
    comentariosVec = request.get_json()
    correctos = 0
    incorrectos = 0
    inicio = time.time()
    for comentario in comentariosVec:
        try:
            comentarios_collection.insert_one(comentario)
            correctos = correctos +1
        except:
            incorrectos = incorrectos+1
    print("===================================")
    fin = time.time()
    tiempoTotal = round(fin-inicio, 2)
    payload = {"guardados": correctos, "api": "python", "TiempoDeCarga": tiempoTotal, "bd": "MongoDb"}
    print(f"Sending payload: {payload}.")
    push_payload(payload, PUB_SUB_TOPIC, PUB_SUB_PROJECT)
    return '''
              '''

if __name__ == '__main__':
    app.run(host='0.0.0.0')
