table! {
    comentarios (id_comentario) {
        id_comentario -> Integer,
        nombre_comentario -> Nullable<Varchar>,
        comentario -> Nullable<Varchar>,
        hashtag -> Nullable<Varchar>,
        fecha_comentario -> Nullable<Date>,
        upvotes_comentario -> Nullable<Integer>,
        down_comentario -> Nullable<Integer>,
    }
}
