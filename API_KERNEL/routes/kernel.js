var express = require('express');
var router = express.Router();
let fs = require('fs')
const ruta_modulo_ram = '/proc/rammodule';
const ruta_modulo_cpu = '/proc/cpumodule';

router.get('/getcpu',async function(req,res,next){
    let data = fs.readFileSync(ruta_modulo_cpu,'utf8');
    console.log(data)
    res.send(data)
})