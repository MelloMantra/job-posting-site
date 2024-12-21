//node src/index.js

/*
app.get('pageName', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'pageFolder', 'page.html'));
});
*/

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
console.log(path.join(__dirname, '..'));
const initialpath = path.join(__dirname, "..");
const fs = require("fs");
const session = require('express-session');
const mysql = require("mysql2");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'Qo^B(#u\Zl447.m{CzR2!9.`C>#xF.Tg',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false, //set to true in production
        httpOnly: false,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

const dbConfig = {
    connectionLimit: 10,
    host: 'sql.freedb.tech',
    user: 'freedb_JobifyAdmin',
    password: 'u&W8pCAh68#pkue',
    database: 'freedb_jobify-database',
    port: 3306,
    connectTimeout: 60000
};

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 

var pool = mysql.createPool(dbConfig);


//Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    
    console.log('Connected to the database successfully!');
    
    connection.release();
    
    pool.end((endErr) => {
        if (endErr) {
            console.error('Error closing the connection pool:', endErr.message);
        } else {
            console.log('Connection pool closed successfully.');
        }
    });
});

app.use(express.static(path.join(initialpath, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    },
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'homeScreen', 'index.html'));
});

app.get('signUp', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'signupScreen', 'signup.html'));
});