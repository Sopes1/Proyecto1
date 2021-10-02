import React, { useEffect, useState } from "react";
import { socket } from '../service/socket.service'
import { PieChart, Pie, Legend, Cell, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from 'recharts'
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader
} from "shards-react";
import PageTitle from "../components/common/PageTitle";
import * as globales from '../data/globales'

export default function Dashboard() {

    const dataTweets = [{
        nombre_comentario: "Autor",
        comentario: "Tweet",
        hashtag: "Hashtags",
        fecha_comentario: "12/12/2021",
        upvotes_comentario: 200,
        down_comentario: 10
    }]

    /* Ultimos Tweets */

    const [ultimosTweets, setUltimosTweets] = useState(dataTweets);

    /* DATOS PRINCIPALES */
    const [noticias, setNoticias] = useState([]);
    const [hashtags, setHastags] = useState([]);
    const [upvotes, setupvotes] = useState([]);

    /* DATOS UPVOTES VS DOWNVOTES */
    var dataAuxUD = [
        {
            name: "Fecha",
            upvotes: 4000,
            downvotes: 2400
        }
    ];

    var [data, setData] = useState(dataAuxUD)

    /* DATOS HASHTAGS */
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F75B5B '];

    var dataHashtags = [
        { name: "Group A", value: 2400 },
        { name: "Group B", value: 4567 },
        { name: "Group C", value: 1398 },
        { name: "Group D", value: 9800 },
        { name: "Group E", value: 3908 }
    ];
    var [data02, setData02] = useState(dataHashtags);

    /* ----------------------------------------------- */

    const codigoSocket = () => {
        window.localStorage.setItem('notis',10)
        window.localStorage.getItem('bd')!=='mongo'?window.localStorage.setItem('bd','mysql'):window.localStorage.setItem('bd','mongo')

        socket.on('listener', () => {
            fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/totales`)
            .then(res => {
                return res.json();
            })
            .then(res => {
                setNoticias(res.totalComentarios);
                setHastags(res.totalHashtags);
                setupvotes(res.totalUpvotes)
            })

        fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/topHashtag`)
            .then(res => {
                return res.json();
            })
            .then(res => {
                let dataAux = []
                res.forEach(element => {
                    dataAux.push({ name: element.Hashtag, value: element.cantidad })
                });
                setData02(dataAux)
            })

        fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/votos`)
            .then(res => {
                return res.json()
            })
            .then(res => {
                console.log(res)
                let dataAux = []
                res.forEach(element => {
                    dataAux.push({ name: element._id || element.fecha_comentario.split('T')[0], upvotes: element.upvotes, downvotes: element.downvotes })
                })
                setData(dataAux)
            })

        fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/lasts`)
            .then(res=>{
                return res.json()
            })
            .then(res=>{
                setUltimosTweets(res)
            })

        })

        fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/totales`)
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    setNoticias(res.totalComentarios);
                    setHastags(res.totalHashtags);
                    setupvotes(res.totalUpvotes)
                })

            fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/topHashtag`)
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    let dataAux = []
                    res.forEach(element => {
                        dataAux.push({ name: element.Hashtag, value: element.cantidad })
                    });
                    setData02(dataAux)
                })

            fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/votos`)
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    console.log(res)
                    let dataAux = []
                    res.forEach(element => {
                        dataAux.push({ name: element._id || element.fecha_comentario.split('T')[0], upvotes: element.upvotes, downvotes: element.downvotes })
                    })
                    setData(dataAux)
                })

            fetch(`${globales.host}${globales.port}/consulta/${window.localStorage.getItem('bd')}/lasts`)
                .then(res=>{
                    return res.json()
                })
                .then(res=>{
                    setUltimosTweets(res)
                })
    }

    useEffect(() => { codigoSocket() }, []);


    function App() {
        return (
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={data02}

                        innerRadius={50}
                        outerRadius={120}
                        fill="#8884d8"
                        labelLine={false}
                        label
                    >
                        {data02.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="top" height={36} />
                </PieChart>
            </ResponsiveContainer>
        );
    }


    /* GRAFICA DE BARRAS */

    function Barras() {
        return (

            <BarChart
                width={1000}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="upvotes" stackId="a" fill="#0088FE" />
                <Bar dataKey="downvotes" stackId="a" fill="#00C49F" />
            </BarChart>
        );
    }


    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="main-content-container px-4">
                <PageTitle title="Dashboard" subtitle="Reportes" className="text-sm-left mb-3" />
            </Row>
            <Row>
                <Col lg="4" key="1">
                    <Card small className="card-post mb-4">
                        <CardBody>
                            <p className="card-text text-muted"> <i className="far fa-newspaper fa-2x mr-1" /> NOTICAS</p>
                            <h5 className="card-title">{noticias}</h5>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="4" key="2">
                    <Card small className="card-post mb-4">
                        <CardBody>
                            <p className="card-text text-muted"> <i className="fab fa-slack-hash fa-2x mr-1" /> HASHTAGS </p>
                            <h5 className="card-title">{hashtags} DIFERENTES</h5>
                        </CardBody>
                    </Card>
                </Col>
                <Col lg="4" key="3">
                    <Card small className="card-post mb-4">
                        <CardBody>
                            <p className="card-text text-muted"> <i className="far fa-thumbs-up fa-2x mr-1" /> upvotes </p>
                            <h5 className="card-title">{upvotes}</h5>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg="8" md="12" sm="12" className="mb-4">
                    <Card small className="h-100">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">upvotes vs DOWNVOTES</h6>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <ResponsiveContainer>
                                <Barras className="blog-users-by-device m-auto" />
                            </ResponsiveContainer>
                        </CardBody>
                    </Card>
                </Col>


                <Col lg="4" md="6" sm="12" className="mb-4">
                    <Card small className="h-100">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">Top Hashtags</h6>
                        </CardHeader>
                        <CardBody className="d-flex py-0">
                            <App className="blog-users-by-device m-auto" />
                        </CardBody>
                    </Card>
                </Col>

            </Row>

            <Row noGutters className="main-content-container px-4">
                <PageTitle subtitle="Últimos Tweets" className="text-sm-left mb-3" />
            </Row>

            <Row>
                <Col>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">Últimos 10 comentarios</h6>
                        </CardHeader>
                        <CardBody className="p-0 pb-3">
                            <table className="table mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            #
                                        </th>
                                        <th scope="col" className="border-0">
                                            Autor
                                        </th>
                                        <th scope="col" className="border-0">
                                            Comentario
                                        </th>
                                        <th scope="col" className="border-0">
                                            Hashtags
                                        </th>
                                        <th scope="col" className="border-0">
                                            Fecha
                                        </th>
                                        <th scope="col" className="border-0">
                                            Upvotes
                                        </th>
                                        <th scope="col" className="border-0">
                                            Downvotes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ultimosTweets.map((post,idx)=>(
                                        <tr>
                                        <td>{post.id_comentario || post._id}</td>
                                        <td>{post.nombre_comentario || post.nombre}</td>
                                        <td>{post.comentario}</td>
                                        <td>{post.hashtag!==undefined?post.hashtag : post.hashtags.toString()}</td>
                                        <td>{post.fecha?post.fecha : post.fecha_comentario.split('T')[0]}</td>
                                        <td>{post.upvotes_comentario || post.upvotes}</td>
                                        <td>{post.down_comentario || post.downvotes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>


        </Container>
    )

}



