const express = require('express')
const cors = require('cors')
const port = 2200;

const { PubSub } = require('@google-cloud/pubsub')
const axios = require('axios')

const app = express()

//MIDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

/* GOOGLE SUBSCRIBER */

const SUB_NAME = 'projects/abiding-circle-325403/subscriptions/subscripcionsopesp1'
const client = new PubSub()

const messages = []

const messageReader = async message =>{
    console.log('Mensaje recibido');
    console.log(`${message.id} - ${message.data}`);
    console.table(message.attributes);

    messages.push({msg:String(message.data),id:message.id,...message.attributes});
    message.ack();

    /*try {
        console.log(`Agregando mensaje al servidor...`);
        const jsonMessage = JSON.parse(message.data) || {};
        const request_body = { name: jsonMessage.Name || jsonMessage.name || "Anonimo", msg: jsonMessage.Msg || jsonMessage.msg || "Empty" };
        await axios.post(process.env.API_URL, request_body);
    }
    catch (e) {
        console.log(`Error al realizar POST ${e.message}`);
    }*/
}

const notificationListener = () =>{
    const sub = client.subscription(SUB_NAME)
    sub.on('message',messageReader);
    console.log("Estoy a la espera de los mensajes...");
}

/* ------------------ */

const consultaRouter = require('./routes/consulta')
app.use('/consulta',consultaRouter)

app.get('/' , (req , res)=>{

   res.send('Se accedio correctamente al puerto ' + port)

})

app.listen(port,function(){
    console.log('Corriendo en el puerto ' + port)
    notificationListener();
})
