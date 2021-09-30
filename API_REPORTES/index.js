const express = require('express')
const cors = require('cors')
const port = 2200;

const { PubSub } = require('@google-cloud/pubsub')
const axios = require('axios')

const app = express()

const server = require('http').createServer(app);
const io = require('socket.io')(server, { 'cors': { 'methods': ['GET', 'PATCH', 'POST', 'PUT'], 'origin': true} });
const ioc = require('socket.io-client')
const socket = ioc.connect('http://localhost:2200', {
    reconnect: true
});


//MIDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

socket.on('enviarDatos',(data)=>{
    console.log('Recibido: ' + data)
})

/* GOOGLE SUBSCRIBER */

const SUB_NAME = 'projects/abiding-circle-325403/subscriptions/subscripcionsopesp1'
const client = new PubSub()

const messages = []

const messageReader = async message =>{
    //console.log('Mensaje recibido');
    //console.log(`${message.id} - ${message.data}`);
    //console.table(message.attributes);

    messages.push(`${message.data}`/*{msg:String(message.data),id:message.id,...message.attributes}*/);
    message.ack();

    socket.emit('enviarNotificacion',{datos: message.data})
}

const notificationListener = () =>{
    const sub = client.subscription(SUB_NAME)
    sub.on('message',messageReader);
    console.log("Estoy a la espera de los mensajes...");
}

/* ------------------ */

/* SOCKETS */

io.on('connection',(socket)=>{

    console.log('User Connected')
    io.socketsJoin('mysql')

    socket.on('enviarNotificacion',(data)=>{
        socket.broadcast.emit('listener',{datos: data.datos.toString()})
    })

})

/* -------------------*/

const consultaRouter = require('./routes/consulta');
app.use('/consulta',consultaRouter)

app.get('/' , (req , res)=>{

   res.send('Se accedio correctamente al puerto ' + port)

})

server.listen(port,function(){
    console.log('Corriendo en el puerto ' + port)
    notificationListener();
})
