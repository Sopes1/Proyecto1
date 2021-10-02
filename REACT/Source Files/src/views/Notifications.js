import React, {useEffect, useState} from "react";
import * as nNotificacion from '../data/notifications_number'
import {
    Container,
    Row,
    Col,
    Card,
    CardBody
  } from "shards-react";
  import PageTitle from "../components/common/PageTitle";
  import { socket } from "../service/socket.service";

  export default function Notifications(){
    
    

    let defaultNotificaciones = [
        {
            guardados: 1000,
            api: "Ejemplo",
            tiempoDeCarga: 10,
            bd: "CosmoDB"
        }
    ]

    const socket_ = socket;
    const [notificaciones,setNotificaciones] = useState(defaultNotificaciones)

    const init_code = ()=>{
        setNotificaciones(nNotificacion.getNotifications())

        
        socket_.on('listener',(data)=>{
            let jsonData = JSON.parse(data.datos);
            let notiAux = nNotificacion.getNotifications();
            //console.log('notiaux:')
            //console.log(notiAux)
            let aux = []
            notiAux.forEach((noti)=>{
                aux.push(noti)
            })
            aux.push({guardados: jsonData.guardados, api: jsonData.api, tiempoDeCarga: jsonData.tiempoDeCarga, bd: jsonData.bd})
            setNotificaciones(aux)
            nNotificacion.setNotifications({guardados: jsonData.guardados, api: jsonData.api, tiempoDeCarga: jsonData.tiempoDeCarga, bd: jsonData.bd})
        })
    }

    useEffect(()=>{init_code();},[])

    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
            <PageTitle sm="4" title="Notificaciones" subtitle="Components" className="text-sm-left" />
            </Row>
            <Row>
            {notificaciones.map((post, idx) => (
                <Col lg="4" key={idx}>
                <Card small className="card-post mb-4">
                    <CardBody>
                    <p className="card-text text-muted"><strong style={{ fontWeight: "bold"}}>Guardados - </strong> <strong style={{fontFamily: "Cursive"}}>{post.guardados}</strong></p>
                    <p className="card-text text-muted"><strong style={{ fontWeight: "bold"}}>Api - </strong> <strong style={{fontFamily: "Cursive"}}>{post.api}</strong></p>
                    <p className="card-text text-muted"><strong style={{ fontWeight: "bold"}}>Tiempo De Carga - </strong> <strong style={{fontFamily: "Cursive"}}>{post.tiempoDeCarga}</strong></p>
                    <p className="card-text text-muted"><strong style={{ fontWeight: "bold"}}>Base De Datos - </strong> <strong style={{fontFamily: "Cursive"}}>{post.bd}</strong></p>
                    </CardBody>
                </Card>
                </Col>
            ))}
            </Row>
        </Container>
    );

  }