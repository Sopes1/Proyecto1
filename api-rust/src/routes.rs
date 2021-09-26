use crate::models::{InsertableComentario, Comentario};

use super::TodoManager;
use crate::schema;
use std::time::{Duration, Instant};
use super::Pool;
use crate::diesel::QueryDsl;
use crate::diesel::RunQueryDsl;
use actix_web::{web, Error, HttpResponse,Responder};
use diesel::dsl::{delete, insert_into};
use serde::{Deserialize, Serialize};
use std::vec::Vec;
use chrono::NaiveDate;
//Pubsub
use cloud_pubsub::Client;
use std::sync::Arc;

#[derive(Deserialize)]
struct Config {
    topic: String,
    google_application_credentials: String,
}

pub async fn add_mysql(
    db: web::Data<Pool>,
    arreglo_comentarios: web::Json<Vec<User>>,
) -> Result<HttpResponse,Error>  {
    let mut correctos = 0;
    let mut incorrectos = 0;
    let start = Instant::now();
    let conn = db.get().unwrap();
    for arreglo in arreglo_comentarios.0.iter(){
        let mut hashtags = "".to_string();
        if arreglo.hashtags.len() >0 {
            let last = arreglo.hashtags.last().unwrap();
            for x in arreglo.hashtags.iter(){
                if x == last{
                    hashtags.push_str(x);
                }else{
                    hashtags.push_str(x);
                    hashtags.push_str(",");
            }
        }
        }
        
        let fecha:Vec<&str>=arreglo.fecha.split("/").collect();
        let guion: String = "- ".to_owned();
        let newFecha = format!("{}-{}-{}", fecha[2], fecha[1],fecha[0]);
        let comentarioInsertar = InsertableComentario { nombre_comentario: arreglo.nombre.clone(),
        comentario:arreglo.comentario.clone(),
        hashtag:hashtags,
        fecha_comentario:NaiveDate::parse_from_str(&*newFecha, "%Y-%m-%d").unwrap(),
        upvotes_comentario:arreglo.upvotes,
        down_comentario:arreglo.downvotes };
       
        let res = insert_into(schema::comentarios::table).values(&comentarioInsertar).execute(&conn).expect("Error inserting person");
        
        let valor = res.to_string();
        let valor2 = "Error inserting person".to_string();
        if valor==valor2{
            incorrectos = incorrectos+1;
        }else{
            correctos = correctos +1;
        }
    }
    let duration = start.elapsed().as_secs();
    let t = format!("{},{}:{},{}:{},{}:{}","fuente:api rust google".to_string(), "correctos".to_string(), correctos,"incorrectos".to_string(),incorrectos, "tiempo(s)".to_string(),duration.to_string());
    add_pub(t).await;
        Ok(HttpResponse::Ok
            ().json(Response {
            respuesta:"jala".to_string(),
        }))     
}

pub async fn add_mongodb(
    db: web::Data<TodoManager>,
    arreglo_comentarios: web::Json<Vec<User>>,
) -> Result<HttpResponse,Error>  {
    let mut correctos = 0;
    let mut incorrectos =0;
    let start = Instant::now();
    for arreglo in arreglo_comentarios.0.iter(){
        let new_user = User {
        nombre:arreglo.nombre.clone(),
        comentario: arreglo.comentario.clone() ,
        hashtags: arreglo.hashtags.clone(),
        fecha: arreglo.fecha.clone(),
        upvotes:arreglo.upvotes ,
        downvotes:arreglo.downvotes,
    };
       let respuesta =  db.add_todo(new_user);
       if respuesta{
           correctos = correctos+1;
       }else{
           incorrectos = incorrectos +1;
       }
    }
    let duration = start.elapsed().as_secs();
    let t = format!("{},{}:{},{}:{},{}:{}","fuente:api rust cosmosdb".to_string(), "correctos".to_string(), correctos,"incorrectos".to_string(),incorrectos, "tiempo(s)".to_string(),duration.to_string());
    add_pub(t).await;
    Ok(HttpResponse::Ok
        ().json(Response {
        respuesta:"jala".to_string(),
    })) 
}


pub async fn add_pub(
    message:String
){
    let parsed_env = envy::from_env::<Config>();
    if let Err(e) = parsed_env {
        eprintln!("ENV is not valid: {}", e);
        std::process::exit(1);
    }
    let config = parsed_env.unwrap();

    let pubsub = match Client::new(config.google_application_credentials).await {
        Err(e) => panic!("Failed to initialize pubsub: {}", e),
        Ok(p) => Arc::new(p),
    };

    let topic = Arc::new(pubsub.topic(config.topic.clone()));
    match topic.clone().publish(message).await {
        Ok(response) => {
            println!("{:?}", response);
            pubsub.stop();
            
        }
        Err(e) => eprintln!("Failed sending message {}", e),
    }
}

#[derive( Serialize,Deserialize,Debug)]
pub struct User {
    pub nombre: String,
    pub comentario: String,
    pub hashtags: Vec<String>,
    pub fecha: String,
    pub upvotes: i32,
    pub downvotes:i32,
}

#[derive(Serialize ,Deserialize,Debug)]
pub struct ArrayComentarios {
    pub comentarios: Vec<User>,

}

#[derive(Serialize ,Deserialize,Debug)]
pub struct Response {
    pub respuesta: String,

}
