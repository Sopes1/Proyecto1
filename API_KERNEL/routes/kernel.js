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


router.get('/getAll',async function(req,res,next){
    let dataCpu = fs.readFileSync(ruta_modulo_cpu,'utf8').split('\n');
    let dataRam = fs.readFileSync(ruta_modulo_ram,'utf8').split('\n');
    
    res.send({Procesos: dataCpu[0], Cpu:dataCpu[1], MemoriaTotal: dataRam[0],MemoriaUso:dataRam[1],MemoriaLibre:dataRam[2],Cached:dataRam[3],Buffers:dataRam[4],PorcentajeUso:dataRam[5]})
})

module.exports = router;