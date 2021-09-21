const dotenv = require('dotenv').config();

var mysql = require('mysql2');

var con = mysql.createConnection({
    host     : process.env.mysqlHost,
    user     : "root",
    password : process.env.mysqlPass,
    database : process.env.mysqlDb,
    port     : "3306" 
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
