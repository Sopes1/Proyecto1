#[macro_use]
extern crate diesel;
/*
extern crate hyper;
extern crate hyper_rustls;
extern crate yup_oauth2 as oauth2;
extern crate google_pubsub1 as pubsub1;
*/
use crate::routes::{User};
use actix_web::{dev::ServiceRequest, web, App, Error, HttpServer,middleware::Logger};
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use actix_cors::Cors;
use mongodb::sync::Client;
use mongodb::sync::Collection;
use mongodb::bson::{doc, Bson};
use mongodb::{error::Error as Errormongo};
use std::collections::HashMap;
/*
use pubsub1::{Result,Error as Errorpub};
use std::default::Default;
use pubsub1::Pubsub;
*/
mod errors;
mod routes;
mod models;
mod schema;

pub type Pool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    std::env::set_var("RUST_LOG", "actix_web=debug");

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");


    // create db connection pool
    let manager = ConnectionManager::<MysqlConnection>::new(database_url);
    let pool: Pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");
    //Create connetion pool mongodb
    let conn_string = std::env::var("MONGODB_URL").expect("missing environment variable MONGODB_URL"); 
    let todos_db_name = std::env::var("MONGODB_DATABASE").expect("missing environment variable MONGODB_DATABASE");
    let todos_collection_name = std::env::var("MONGODB_COLLECTION").expect("missing environment variable MONGODB_COLLECTION");
    let mongo_client = Client::with_uri_str(&*conn_string).expect("failed to create client");
    let todo_coll = mongo_client.database(&todos_db_name).collection(&todos_collection_name);

    let tm = TodoManager::new(todo_coll.clone());
    // Start http server
    HttpServer::new(move || {
        let cors = Cors::default()
              .supports_credentials();
        App::new()
        .data(pool.clone())
        .data(tm.clone())
        .wrap(cors)
        .wrap(Logger::default())
        .route("/rust/publicar/mysql", web::post().to(routes::add_mysql))
        .route("/rust/publicar/mongodb", web::post().to(routes::add_mongodb))

    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}


#[derive(Clone)]
pub struct TodoManager {
    coll: Collection
}


impl TodoManager{
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

   
}
/*
pub async fn pubsub(){
    let secret: oauth2::ApplicationSecret = Default::default();

let auth = yup_oauth2::InstalledFlowAuthenticator::builder(
        secret,
        yup_oauth2::InstalledFlowReturnMethod::HTTPRedirect,
    ).build().await.unwrap();
let mut hub = Pubsub::new(hyper::Client::builder().build(hyper_rustls::HttpsConnector::with_native_roots()), auth);

let result = hub.projects().schemas_get_iam_policy("key.json")
             .options_requested_policy_version(-27)
             .doit().await;
 
match result {
    Err(e) => match e {

        Errorpub::HttpError(_)
        |Errorpub::Io(_)
        |Errorpub::MissingAPIKey
        |Errorpub::MissingToken(_)
        |Errorpub::Cancelled
        |Errorpub::UploadSizeLimitExceeded(_, _)
        |Errorpub::Failure(_)
        |Errorpub::BadRequest(_)
        |Errorpub::FieldClash(_)
        |Errorpub::JsonDecodeError(_, _) => println!("{}", e),
    },
    Ok(res) => println!("Success: {:?}", res),
}
}*/