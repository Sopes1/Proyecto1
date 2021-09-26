use chrono::NaiveDateTime;
use chrono::NaiveDate;
use crate::schema::comentarios;
use serde::{Deserialize, Serialize};

/// This represents a page view pulled from the database, including the auto-generated fields
#[derive(Serialize, Deserialize, Queryable)]
pub struct Comentario {
    pub id_comentario: i32,
    pub nombre_comentario: String,
    pub comentario: String,
    pub hashtag: String,
    pub fecha_comentario: NaiveDate,
    pub upvotes_comentario: i32,
    pub down_comentario:i32,
}

/// This represents a page view being inserted into the database, without the auto-generated fields
#[derive(Deserialize, Insertable)]
#[table_name = "comentarios"]
pub struct InsertableComentario {
    pub nombre_comentario: String,
    pub comentario: String,
    pub hashtag: String,
    pub fecha_comentario: NaiveDate,
    pub upvotes_comentario: i32,
    pub down_comentario:i32,
}
