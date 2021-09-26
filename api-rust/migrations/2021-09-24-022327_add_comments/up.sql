CREATE TABLE `sopesP1`.`comentarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NULL,
  `comentario` VARCHAR(250) NULL,
   `hashtags` VARCHAR(300) NULL,
  `fecha`VARCHAR(250) NULL,
  `upvotes` Int null,
  `downvotes` Int null,
  PRIMARY KEY (`id`))