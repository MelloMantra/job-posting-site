//node src/index.js
// Below is an example of how to add a new page to the backend for Matteo.
/*
app.get('pageName', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'pageFolder', 'page.html'));
});
*/

// Node Modules
const express = require("express");
const path = require("path");
const session = require('express-session');

//Constants & Setup
const port = process.env.PORT || 3000;
const initialpath = path.join(__dirname, "..");

//Local Modules
const pool = require('./db');
const userRoutes = require('./user/userRoutes');
const companyRoutes = require('./company/companyRoutes');

//Middleware Setup
  //App
const app = express();
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

  //Router
const router = express.Router();
router.use('/user', userRoutes);
router.use('/company', companyRoutes);
app.use('/api', router);

console.log(path.join(__dirname, '..'));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 


//Test connection
dbTest =  pool.query("SELECT * FROM universities WHERE id = 200");
console.log(dbTest);

app.use(express.static(path.join(initialpath, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'text/javascript');
        }
    },
}));

//Page Redirects (NOT API)
app.get('/', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'homeScreen', 'index.html'));
});

app.get('signUp', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'signupScreen', 'signup.html'));
});