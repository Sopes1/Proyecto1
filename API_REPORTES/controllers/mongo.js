const {MongoClient} = require('mongodb');
var dotenv = require('dotenv').config();
var assert = require('assert');
const client = new MongoClient(process.env.mongoURI)
client.connect()

exports.getAll = async(req,res) =>{
    try{
        //await client.connect();
        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).toArray(function(err,result){
            if (!err){
                res.send(result)
            }else{
                res.send({error:err})
            }
        })
    } catch (e) {
        res.status(404).send({error:e})
    }
}

exports.getMessages =async()=> {
    try{
        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).toArray(function(err,result){
            if (!err){
                return result
            }else{
                return result
            }
        })
    } catch (e) {
        return -1
    }
}

exports.totalNoticias = async(req,res)=>{
    try{
        //await client.connect();
        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).toArray(function(err,result){
            if (!err){
                return res.send({total: Object.keys(result).length})
            }else{
                return res.send({error:err})
            }
        })
    } catch (e) {
        return res.send({err:error})
    }
}

exports.totalUpvotes = async(req,res)=>{
    try{
        //await client.connect();
        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).toArray(function(err,result){
            if (!err){
                return res.send({total: Object.keys(result).length})
            }else{
                return res.send({error:err})
            }
        })
    } catch (e) {
        return res.send({err:error})
    }
}

exports.totales = async(req,res)=>{
    try{
        //await client.connect();
        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).toArray(function(err,result){

            if (!err){
                let totalNoticias = Object.keys(result).length
                let totalUpvotes = 0

                let hashtags = []

                result.forEach(item=>{
                    totalUpvotes += parseInt(item.upvotes)

                    if(item.hashtags){
                        item.hashtags.forEach((hs)=>{
                            if(!hashtags.includes(hs)){
                                hashtags.push(hs)
                            }
                        })
                    }

                })


                return res.send({totalComentarios: Object.keys(result).length, totalUpvotes: totalUpvotes, totalHashtags: hashtags.length})

            }else{
                return res.send({error:err})
            }

        })
    } catch (e) {
        return res.send({err:e})
    }
}

exports.topHashtags = async(req,res)=>{
    try{
        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).toArray(function(err,result){

            if(err){
                return res.send({error:err})
            }

            let hashtag = new Map()

            result.forEach((comentario)=>{
                if(comentario.hashtags){
                    comentario.hashtags.forEach((hash)=>{
                        if(hashtag.has(hash)){
                            if(comentario.upvotes)
                                hashtag.set(hash,hashtag.get(hash) + comentario.upvotes);
                        }else{
                            if (comentario.upvotes){
                                hashtag.set(hash,comentario.upvotes);
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
    }catch(e){
        return res.send({error:e})
    }
}

exports.votos = async(req,res)=>{

    try{

        const result = await client.db('Proyecto1Sopes').collection('Comentarios').aggregate([

            {
                $group: {
                    _id: '$fecha',
                    upvotes: {$sum:"$upvotes"},
                    downvotes: {$sum: "$downvotes"}
                }
            }

        ]).toArray((err,results)=>{
            if(err){
                return res.send({error:err})
            }
            res.send(results)
        });

    }catch(e){
        return res.send({error:e})
    }

}

exports.getLast = async(req,res)=>{

    try{

        const result = await client.db('Proyecto1Sopes').collection('Comentarios').find({}).sort({_id:-1}).limit(10).toArray(function(err,result){

            if(err){
                return res.send({error:err})
            }

            return res.send(result)

        })

    }catch(e){

    }

}