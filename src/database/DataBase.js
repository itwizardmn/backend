// const mysql = require('mysql');
const mysql   = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    multipleStatements: true,
    typeCast : true
});

pool.on('acquire', (connection) => {
    console.log(`Connection ${connection.threadId} acquired`);
});

pool.on('enqueue', () => {
    console.log(`Waiting for available connection slot`);
});

pool.on('release', (connection) => {
    console.log(`Connection ${connection.threadId} released`);
});

pool.on('connection', () => {
    console.log(`Connection pool created`);
});

pool.on('query', (query) => { console.log(query.sql) });

const getPoolConnection = async () => {
    const connection = 
        await pool.getConnection(async (err, conn) => {
            if (err) 
                console.log(err);
            else
                console.log(`Connection success`);
        });
    return connection;
  }

module.exports = getPoolConnection;