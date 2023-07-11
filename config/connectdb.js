const mysql = require('mysql2');
const dbconnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'book',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
});

dbconnection.getConnection(function (err, connection) {
  if (err) {
    throw new Error('fail connect');
  }
  console.log('Connect success !!!');
});
module.exports = dbconnection;