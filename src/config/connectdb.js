const mysql = require('mysql2');

const dbconnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  port: process.env.DB_PORT,
});


dbconnection.getConnection(function (err, connection) {
  if (err) {
    throw new Error('fail connect');
  }
  console.log('Connect success !!!');
});
module.exports = dbconnection;