var express = require('express');
var router = express.Router();
let fs = require('fs')
const ruta_modulo_ram = '/proc/rammodule';
const ruta_modulo_cpu = '/proc/cpumodule';

router.get('/getcpu',async function(req,res,next){
    let dataResponse = fs.readFileSync(ruta_modulo_cpu,'utf8');
    let data = dataResponse.split('\n')
    console.log(dataResponse)
    res.send({procesos:data[0],cpu:data[1]})
})

router.get('/getram',async function(req,res,next){
    let dataResponse = fs.readFileSync(ruta_modulo_ram,'utf8');
    let data = dataResponse.split('\n')
    console.log(dataResponse)
    res.send({MemoriaTotal: data[0],MemoriaUso:data[1],MemoriaLibre:data[2],Cached:data[3],Buffers:data[4],PorcentajeUso:data[5]})
})

module.exports = router;