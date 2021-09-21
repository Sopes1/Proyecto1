const sql = require("../config/dbMysql")

exports.getAll = async(req,res) => {
    sql.query('Select * from comentarios;',(err,result)=>{
        if(err){
            return res.status(400).json({error:err})
        }else{
            return res.status(200).send(result)
        }
    })
}