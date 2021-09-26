
#![feature(proc_macro_hygiene, decl_macro)]

extern crate chrono;
#[macro_use]
extern crate diesel;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
extern crate serde;
extern crate serde_json;

#[macro_use]
extern crate serde_derive;


pub mod cors;
pub mod models;
pub mod routes;
pub mod schema; // Ignore errors from this for now; it doesn't get created unti later
use dotenv::dotenv;

// This registers your database with Rocket, returning a `Fairing` that can be `.attach`'d to your
// Rocket application to set up a connection pool for it and automatically manage it for you.
#[database("rocket_app")]
pub struct DbConn(diesel::MysqlConnection);

#[database("mongo_connection")]
pub struct MongoConn(rocket_contrib::databases::mongodb::db::Database);
fn main() {
    dotenv().ok();
    rocket::ignite()
        .mount(
            "/",
            routes![
                //routes::index,
                routes::create_mysql,
                routes::create_mongodb
            ],
        )
        .attach(DbConn::fairing())
        .attach(DbConn::fairing())
        .attach(cors::CorsFairing)
        .launch();
}
