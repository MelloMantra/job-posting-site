const mysql = require('mysql2');

const dbConfig = {
    connectionLimit: 10,
    host: 'sql.freedb.tech',
    user: 'freedb_JobifyAdmin',
    password: 'u&W8pCAh68#pkue',
    database: 'freedb_jobify-database',
    port: 3306,
    connectTimeout: 60000
};

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();