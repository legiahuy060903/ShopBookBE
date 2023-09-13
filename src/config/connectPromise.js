const mysqlAsync = require('mysql2/promise');
const pool = mysqlAsync.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    port: process.env.DB_PORT,
});
module.exports = pool;