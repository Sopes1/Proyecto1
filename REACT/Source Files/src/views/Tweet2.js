import React, { useEffect, useState } from "react";
import { socket } from "../service/socket.service";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import * as globales from '../data/globales';

export default function Tweet2() {

  const [tweets_,setTweets_] = useState([{
                                            nombre_comentario: "Ejemplo-Autor",
                                            comentario: "Comentario Del Tweet",
                                            hashtag: "Hashtags",
                                            fecha_comentario: "dd/mm/yyyy",
                                            upvotes_comentario: 200,
                                            down_comentario: 100
                                        }]);


  const codigo = () => {
    socket.on("listener", data => {
      let jsonData = JSON.parse(data.datos);
      //nNotificacion.setNotifications(jsonData)
      alert(
        `Guardados: ${jsonData.guardados}\n Api: ${jsonData.api}\n Tiempo De Carga: ${jsonData.tiempoDeCarga}\n Base de datos: ${jsonData.bd}`
      );

      if (window.localStorage.getItem("bd") !== "mongo") {
        //Jalar Datos De Mongo
        window.localStorage.setItem('bd','mysql')
      }

      fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/all`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          setTweets_(res);
        });


    });

    fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/all`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          setTweets_(res);
        });
  };


  useEffect(() => {codigo()}, []);

  function cambiarMysql() {
    console.log("Se cambio a mysql");
    //this.state.socket.emit('cambiarMysql')
    window.localStorage.setItem("bd", "mysql");
    fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/all`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          setTweets_(res);
        });
  }

  function cambiarMongo() {
    console.log("Se cambio a mongo");
    //this.state.socket.emit('cambiarMongo')
    window.localStorage.setItem("bd", "mongo");
    fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/all`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          setTweets_(res);
        });
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Tweets"
          subtitle="Components"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <div className="my-auto ml-auto">
          <Button size="sm" theme="white" onClick={cambiarMysql}>
            Mysql
          </Button>{" "}
          <Button size="sm" theme="white" onClick={cambiarMongo}>
            Mongo
          </Button>
        </div>
      </Row>
      <Row>
        <br></br>
      </Row>
      <Row>
        {tweets_.map((post, idx) => (
          <Col lg="4" key={idx}>
            <Card small className="card-post mb-4">
              <CardBody>
                <h5 className="card-title">{post.comentario}</h5>
                <p className="card-text text-muted">
                  #
                  {window.localStorage.getItem("bd") === "mongo"
                    ? post.hashtags!== undefined?post.hashtags.join(" #"): 0
                    : post.hashtag.split(",").join(" #")}
                </p>
                <p className="card-text text-muted">
                  <strong style={{ fontWeight: "bold" }}>
                    {post.upvotes_comentario || post.upvotes}
                  </strong>{" "}
                  UPVOTES{" "}
                  <strong style={{ fontWeight: "bold" }}>
                    {post.down_comentario || post.downvotes}
                  </strong>{" "}
                  DOWNVOTES
                </p>
              </CardBody>
              <CardFooter className="border-top d-flex">
                <div className="card-post__author d-flex">
                  <div
                    className="card-post__author-avatar card-post__author-avatar--small"
                    style={{
                      backgroundImage: `url('${require("../images/avatars/dp.png")}')`
                    }}
                  ></div>
                  <div className="d-flex flex-column justify-content-center ml-3">
                    <span className="card-post__author-name">
                      {post.nombre_comentario || post.nombre}
                    </span>
                    <small className="text-muted">
                      {window.localStorage.getItem("bd") === "mongo"
                        ? post.fecha
                        : post.fecha_comentario.split("T")[0]}
                    </small>
                  </div>
                </div>
                <div className="my-auto ml-auto">
                  <Button size="sm" theme="white">
                    <i className="far fa-comment mr-1" /> Comentar
                  </Button>
                  <Button size="sm" theme="white">
                    <i className="far fa-heart mr-1" /> Me gusta
                  </Button>
                  <Button size="sm" theme="white">
                    <i className="fas fa-retweet mr-1" /> Retwitear
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
