const express = require('express')
const cors = require('cors')
const port = 2200;

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

const consultaRouter = require('./routes/consulta')
app.use('/consulta',consultaRouter)

app.get('/' , (req , res)=>{

   res.send('Se accedio correctamente al puerto ' + port)

})

app.listen(port,function(){
    console.log('Corriendo en el puerto ' + port)
})
