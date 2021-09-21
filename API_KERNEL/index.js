const express = require('express');
const app = express();
var morgan = require('morgan');
var cors = require('cors')
const dotenv = require('dotenv').config()
//Para Prometheus
const client = require('prom-client')
const register = new client.Registry()

register.setDefaultLabels({
    app: process.env.nombrePC
})

client.collectDefaultMetrics({register})

app.get('/metrics' , (req , res)=>{

    res.setHeader('Content-Type',register.contentType)
    res.end(register.metrics())

})

const port = 3100;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/' , (req , res)=>{

   res.send('Se accedio correctamente al servidor')

})
app.use("/kernel",require('./routes/kernel'));

app.listen(port,()=>{
    console.log('Servidor escuchando en el puerto' + port)
})