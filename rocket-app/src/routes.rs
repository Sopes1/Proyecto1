use diesel::{self, prelude::*};
use std::time::{Duration, Instant};
use std::thread::sleep;
use rocket_contrib::json::Json;
use chrono::NaiveDate;
use crate::models::{InsertableComentario, Comentario};
use crate::schema;
use crate::DbConn;
use std::collections::HashMap;
use std::env;


#[post("/rust/publicar/mysql", format = "application/json" ,data = "<arreglo_comentarios>")]
pub fn create_mysql(
    conn: DbConn,
    arreglo_comentarios: Json<Vec<User>>,
)-> Json<Response> {
    /*let s: String = user.0.hashtags.into_iter().collect();
    println!("{}", s);*/

    let mut correctos = 0;
    let mut incorrectos = 0;
    let start = Instant::now();
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

        let inserted_rows = diesel::insert_into(schema::comentarios::table)
        .values(&comentarioInsertar)
        .execute(&conn.0)
        .map_err(|err| -> String {
            incorrectos = incorrectos +1;
            println!("Error inserting row: {:?}", err);
            "Error inserting row into database".into()
        });
        correctos = correctos+1;
    }

        let duration = start.elapsed().as_secs();
        println!("{:?}", duration);
      
        Json(Response { correctos:correctos,incorrectos:incorrectos, tiempo: duration.to_string() })

}


#[post("/rust/publicar/mongodb", data = "<arreglo_comentarios>")]
pub fn create_mongodb(
    arreglo_comentarios: Json<Vec<User>>,
)-> Json<Response> {
    let mut correctos = 0;
    let mut incorrectos = 0;
   /* let conn_string = env::var("MONGODB_URL").expect("missing environment variable MONGODB_URL"); 
    let todos_db_name = env::var("MONGODB_DATABASE").expect("missing environment variable MONGODB_DATABASE");
    let todos_collection_name = env::var("MONGODB_COLLECTION").expect("missing environment variable MONGODB_COLLECTION");
    let mongo_client = Client::with_uri_str(&*conn_string).expect("failed to create client");
    let todo_coll = mongo_client.database(&todos_db_name).collection(&todos_collection_name);

    let tm = TodoManager::new(todo_coll.clone());
    
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
        tm.add_todo(new_user);
    }
    */
    
    let duration = start.elapsed().as_secs();
    Json(Response { correctos:correctos,incorrectos:incorrectos, tiempo: duration.to_string() })
 
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

#[derive(Serialize, Deserialize)]
pub struct Response {
    pub correctos: i32,
    pub incorrectos: i32,
    pub tiempo: String
}
#[derive(Clone)]
struct TodoManager {
    coll: Collection
}

/*pub fn insertMongo(new_todo:User)-> bool{
   
    let retorno = tm.add_todo(new_todo);
    
    return retorno;
}*/
/*impl TodoManager{
    fn new(todo_coll:Collection) -> TodoManager{

        TodoManager{coll: todo_coll}
    }

    fn add_todo(&self, new_todo:User)->bool{
       
    
        let todo_doc = mongodb::bson::to_bson(&new_todo).expect("struct to BSON conversion failed").as_document().expect("BSON to Document conversion failed").to_owned();
        
        let r = self.coll.insert_one(todo_doc, None).expect("failed to add todo");
        println!("inserted todo with id = {}", r.inserted_id);
        let mut retorno = true;
        let valor = r.inserted_id.to_string();
        let valor2 = "failed to add todo".to_string();
        if valor==valor2{
            retorno = false;
        }
    
        return retorno;
    }

   
}*/