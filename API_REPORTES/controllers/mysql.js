const sql = require("../config/dbMysql")

exports.getAll = async(req,res) => {
    console.log('Obteniendo datos')
    sql.query('Select * from comentarios;',(err,result)=>{
        if(err){
            return res.status(400).json({error:err})
        }else{
            return res.status(200).send(result)
        }
    })
}

exports.getMessages = async() =>{
    console.log('Obteniendo Mensajes')
    sql.query('Select * from comentarios;',(err,result)=>{
        if(err){
            return -1
        }else{
            console.log('Retorno')
            return result
        }
    })
}

exports.totales = async(req,res)=>{
    sql.query('Select * from comentarios',(err,result)=>{
        if(err){
            return res.status(400).json({error:err})
        }else{
            // CANTIDAD UPVOTES
            let upvotes = 0;

            // HASHTAGS NO REPETIDOS
            let hashtags = [];

            // CANTIDAD DE COMENTARIOS
            let nComentarios = Object.keys(result).length;

            result.forEach((dato)=>{

                //SUMAR UPVOTES
                if (dato.upvotes_comentario)
                    upvotes += parseInt(dato.upvotes_comentario);

                //HASHTAGS
                if (dato.hashtag)
                    {
                        let hs = dato.hashtag.split(',');
                        hs.forEach((hashtag)=>{
                            if (!hashtags.includes(hashtag)){
                                hashtags.push(hashtag);
                            }
                        });
                    }
                
            })
            return res.status(200).json({totalComentarios: nComentarios, totalUpvotes: upvotes, totalHashtags: hashtags.length})

        }
    })
}

exports.topHashtag = async(req,res)=>{

    sql.query('Select * from comentarios',(err,result)=>{

        let hashtag = new Map()

        result.forEach((dato)=>{

            if(dato.hashtag){

                let hs = dato.hashtag.split(',');
                
                hs.forEach((hash)=>{
                    if(hashtag.has(hash)){
                        if(dato.upvotes_comentario)
                            hashtag.set(hash,hashtag.get(hash) + dato.upvotes_comentario);
                    }else{
                        if (dato.upvotes_comentario){
                            hashtag.set(hash,dato.upvotes_comentario);
                        }else{
                            hashtag.set(hash,0)
                        }
                    }
                })
            }

        })
        let sortedHashtags = new Map([...hashtag.entries()].sort((a, b) => b[1] - a[1]))

        let topHashtags = [];
        let index = 0
        sortedHashtags.forEach((value,key)=>{
            if (index>=5)
                return
            index++
            topHashtags.push({Hashtag: key, cantidad: value})
        })

        return res.send(topHashtags)

    })

}

exports.votos = async(req,res)=>{
    sql.query(`Select fecha_comentario, sum(upvotes_comentario) as upvotes, sum(down_comentario) as downvotes
	            From comentarios
		            Group By fecha_comentario;`,(err,result)=>{
                        if(err)
                            return res.status(404).send({error:err})
                        
                        return res.send(result)
                    })
}

exports.getLastst = async(req,res)=>{
    sql.query(`Select * from comentarios 
	            Order By id_comentario desc
		            limit 10;`,(err,result)=>{

                        if(err){
                            return res.status(404).send({error:err})
                        }else{
                            return res.send(result)
                        }

                    })
}