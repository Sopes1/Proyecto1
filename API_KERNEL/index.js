const express = require('express');
const app = express();
var morgan = require('morgan');
var cors = require('cors')
const dotenv = require('dotenv').config()
var fs = require('fs')
//import {Gauge} from 'prom-client'
var client = require('prom-client')
const port = 3100;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/' , (req , res)=>{

   res.send('Se accedio correctamente al servidor')

})
app.use("/kernel",require('./routes/kernel'));


/** */

//client.collectDefaultMetrics()
const register = new client.Registry()

const all_process = new client.Gauge({
    name: 'Processes_Running',
    help: 'Numero total de procesos corriendo',
    labelNames: ['Procesos']
})

async function collectMetrics(){
    try{
        console.log('Hello from here')
        const cpuData = fs.readFileSync('/proc/cpumodule','utf8').split('\n');
        all_process.labels('procesos').set(parseInt(cpuData[0]))
    }catch (e){
        console.log(e)
    }
}

register.registerMetric(all_process)

app.use('/metrics',async(req,res)=>{
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
})

/** */


app.listen(port,()=>{
    console.log('Servidor escuchando en el puerto ' + port)
    setInterval(() => {
        collectMetrics()
      }, 5000)
})