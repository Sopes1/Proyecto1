const express = require('express');
const app = express();
var morgan = require('morgan');
var cors = require('cors')

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