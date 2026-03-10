const mysql = require('mysql2');
const config = require('./appConfig');

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
