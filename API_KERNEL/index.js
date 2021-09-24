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


/** PROMETHEUS **/
const register = new client.Registry()

const all_process = new client.Gauge({
    name: 'Processes_Running',
    help: 'Numero total de procesos corriendo',
    labelNames: ['Procesos']
})

const cpu_usage = new client.Gauge({
    name: 'Cpu_Usage',
    help: 'Porcentaje de cpu utilizado',
    labelNames: ['Cpu']
})

const memoria_total = new client.Gauge({
    name: 'total_ram',
    help: 'Total de memoria ram',
    labelNames: ['TotalRam']
})

const memoria_uso = new client.Gauge({
    name: 'ram_uso',
    help: 'Total de memoria ram en uso',
    labelNames: ['Ramuso']
})

const memoria_libre = new client.Gauge({
    name: 'ram_libre',
    help: 'Total de memoria ram libre',
    labelNames: ['Ramlibre']
})

const Cached = new client.Gauge({
    name: 'Cached',
    help: 'Cached Memoria',
    labelNames: ['Totalcached']
})

const Buffers = new client.Gauge({
    name: 'total_buffers',
    help: 'Total de Buffers',
    labelNames: ['TotalBuffers']
})

const pRam_uso = new client.Gauge({
    name: 'total_percentage_used',
    help: 'Porcentaje total en uso',
    labelNames: ['TotalRamUsed']
})

async function collectMetrics(){
    try{
        console.log('Hello from here')
        const cpuData = fs.readFileSync('/proc/cpumodule','utf8').split('\n');
        const ramData = fs.readFileSync('/proc/rammodule','utf-8').split('\n');

        all_process.labels('procesos').set(parseInt(cpuData[0]))
        cpu_usage.labels('cpuUsage').set(parseInt(cpuData[1]))
        memoria_total.labels('totalRam').set(parseInt(ramData[0]))
        memoria_uso.labels('totalRamUso').set(parseInt(ramData[1]))
        memoria_libre.labels('totalRamLibre').set(parseInt(ramData[2]))
        Cached.labels('Cached').set(parseInt(ramData[3]))
        Buffers.labels('totalBuffers').set(parseInt(ramData[4]))
        pRam_uso.labels('PorcentajeRam').set(parseInt(ramData[5]))

    }catch (e){
        console.log(e)
    }
}

register.registerMetric(all_process)
register.registerMetric(cpu_usage)
register.registerMetric(memoria_total)
register.registerMetric(memoria_uso)
register.registerMetric(memoria_libre)
register.registerMetric(Cached)
register.registerMetric(Buffers)
register.registerMetric(pRam_uso)

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