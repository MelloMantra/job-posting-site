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
const generalRoutes = require('./routes');

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

router.use('/all', generalRoutes);
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

app.get('/userSignUp', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'signupScreen', 'signup.html'));
});

//Either login/user or login/company
app.get('/login/:loginType', (req, res) => {
    if (req.params.loginType != "user" && req.params.loginType != "company") {
        res.status(400).json({ error: 'Invalid login type. Must be "user" or "company"' });
    } else {
        res.sendFile(path.join(initialpath, 'public', 'loginScreen', 'login.html'));
    }
});

app.get('/privacy' , (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'privacy', 'privacy.html'));
});

app.get('/terms' , (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'privacy', 'terms.html'));
});

app.get('/forgot' , (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'forgotScreen', 'forgot.html'));
})

app.get('/job/:jobId', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'jobDetails', 'job.html'));
})

app.get('/createJob', (req, res) => {
    //Uncomment below portion once done testing
    const companyId = 1; //for testing purposes
    //const companyId = req.session?.companyId;
    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }
    res.sendFile(path.join(initialpath, 'public', 'createJob', 'createJob.html'));
});

app.get('/allApps/:jobId', (req, res) => {
    //comment below portion if testing
    const companyId = req.session?.companyId;
    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }
    res.sendFile(path.join(initialpath, 'public', 'allApps', 'allApps.html'));
});

app.get('/searchJobs', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'searchJobs', 'jobsearching.html'));
});

app.get('/testPdfUpload', (req, res) => {
    const areTesting = false;
    if (areTesting) {
        res.sendFile(path.join(initialpath, 'public', 'test', 'testResumeUpload.html'));
    } else {
        res.status(401).json({ error: 'Not in testing mode.' });
    }
})

app.get('/allJobs', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'allJobs', 'allJobs.html'));
});

app.get('/userAllApps', (req, res) => {
        //comment below portion if testing
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }
    res.sendFile(path.join(initialpath, 'public', 'userAllApps', 'userAllApps.html'));
});

app.get('/employerDashboard', (req, res) => {
    //comment below portion if testing
    const companyId = req.session?.companyId;
    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }
    res.sendFile(path.join(initialpath, 'public', 'employerDashboard', 'employerDashboard.html'));
});

app.get('/employeeDashboard', (req, res) => {
    //comment below portion if testing
    //req.session.userId = 1;
    const userId = req.session?.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }
    res.sendFile(path.join(initialpath, 'public', 'employeeDashboard', 'employeeDashboard.html'));
});

app.get('/selecttype', (req, res) => {
    res.sendFile(path.join(initialpath, 'public', 'loginScreen', 'selecttype.html'));
});