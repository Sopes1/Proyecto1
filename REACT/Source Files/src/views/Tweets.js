import React from "react";
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
import io from 'socket.io-client';

import * as dataHashtags from '../data/dataHashtags'

class Tweets extends React.Component{
    constructor(props) {
        
        super (props);
        this.state = {
            tweets:[
                /*{
                    nombre_comentario: "Autor",
                    comentario: "Tweet",
                    hashtag: "a,b,c,d",
                    fecha_comentario: "12/12/2021",
                    upvotes_comentario: 200,
                    down_comentario: 10
                }*/
            ],
            socket: io('http://localhost:2200')
        };

        this.state.socket.on('listener',()=>{
            console.log('Si se pudo')
        })
    }

    cambiarMysql(){
        console.log('Se cambio a mysql')
        //this.state.socket.emit('cambiarMysql')
        window.localStorage.setItem('bd','mysql')
    }
    

    cambiarMongo(){
        console.log('Se cambio a mongo')
        //this.state.socket.emit('cambiarMongo')
        window.localStorage.setItem('bd','mongo')
    }
    

    componentDidMount(){
        
        this.state.socket.on('listener',(data)=>{
            alert('Llego data')
            let jsonData = JSON.parse(data.datos)
            alert(`Guardados: ${jsonData.guardados}\n Api: ${jsonData.api}\n Tiempo De Carga: ${jsonData.tiempoDeCarga}\n Base de datos: ${jsonData.bd}`)

            if (window.localStorage.getItem('bd')==='mongo'){
                //Jalar Datos De Mongo
                console.log('Obteniendo de Mongo')
                fetch('http://localhost:2200/consulta/mongo/all')
                .then(res=>{
                    return res.json()
                })
                .then(res=>{
                    this.setState({
                        tweets: res
                    })
                })
            }else{
                //Jalar Datos De Mysql
                console.log('Obteniendo de Mysql')
                fetch('http://localhost:2200/consulta/mysql/all')
                .then(res=>{
                    return res.json()
                })
                .then(res=>{
                    this.setState({
                        tweets: res
                    })
                })
            }

            //Cambiar Datos Grafica
            console.log(dataHashtags.getNames())
            dataHashtags.setNames(['Juan','Pablo','Ardon','Lopez','Juarez'])
            console.log(dataHashtags.getNames())

        })

        if (window.localStorage.getItem('bd')==='mongo'){
            //Jalar Datos De Mongo
            console.log('Obteniendo de Mongo')
            fetch('http://localhost:2200/consulta/mongo/all')
            .then(res=>{
                return res.json()
            })
            .then(res=>{
                this.setState({
                    tweets: res
                })
            })
        }else{
            //Jalar Datos De Mysql
            console.log('Obteniendo de Mysql')
            fetch('http://localhost:2200/consulta/mysql/all')
            .then(res=>{
                return res.json()
            })
            .then(res=>{
                this.setState({
                    tweets: res
                })
            })
        }
    }

    render() {
        const {
            tweets
        } = this.state;

        return (
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                <PageTitle sm="4" title="Tweets" subtitle="Components" className="text-sm-left" />
                </Row>
                <Row>
                    <div className="my-auto ml-auto" >
                        <Button size="sm" theme="white" onClick={this.cambiarMysql}>Mysql</Button> <Button size="sm" theme="white" onClick={this.cambiarMongo}>Mongo</Button>
                    </div>
                </Row>
                <Row>
                    <br></br>
                </Row>
                <Row>
                {tweets.map((post, idx) => (
                    <Col lg="4" key={idx}>
                    <Card small className="card-post mb-4">
                        <CardBody>
                        <h5 className="card-title">{post.comentario}</h5>
                        <p className="card-text text-muted">#{window.localStorage.getItem('bd')==='mongo'?0:post.hashtag.split(',').join(' #')}</p>
                        <p className="card-text text-muted"><strong style={{fontWeight:"bold"}}>{post.upvotes_comentario||post.upvotes}</strong> UPVOTES <strong style={{fontWeight:"bold"}}>{post.down_comentario||post.downvotes}</strong> DOWNVOTES</p>
                        </CardBody>
                        <CardFooter className="border-top d-flex">
                        <div className="card-post__author d-flex">
                            <a
                            href="/#"
                            className="card-post__author-avatar card-post__author-avatar--small"
                            style={{ backgroundImage: `url('${require("../images/avatars/dp.png")}')` }}
                            >
                            </a>
                            <div className="d-flex flex-column justify-content-center ml-3">
                            <span className="card-post__author-name">
                                {post.nombre_comentario||post.nombre}
                            </span>
                            <small className="text-muted">{window.localStorage.getItem('bd')==='mongo'?post.fecha:post.fecha_comentario.split('T')[0]}</small>
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
}


export default Tweets;