const mysqlAsync = require('mysql2/promise');
const pool = mysqlAsync.createPool({
    host: 'localhost',
    user: 'root',
    database: 'book',
    password: '',
    waitForConnections: true,
    connectionLimit: 10,
    port: 3309,
});
module.exports = pool;