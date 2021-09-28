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

                result.forEach(item=>{
                    console.log(totalUpvotes)
                    totalUpvotes += parseInt(item.upvotes)
                })


                return res.send({totalComentarios: Object.keys(result).length, totalUpvotes: totalUpvotes})

            }else{
                return res.send({error:err})
            }

        })
    } catch (e) {
        return res.send({err:e})
    }
}

