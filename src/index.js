//node src/index.js
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
console.log(path.join(__dirname, '..'));
const initialpath = path.join(__dirname, "..");

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 