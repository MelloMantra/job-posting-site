const express = require('express');
const {login, signUp, postJob, getJobs, deleteJob, updateJobStatus} = require('./companyController');

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/postJob', postJob);
router.get('/getJobs', getJobs);
router.post('/deleteJob', deleteJob);
router.post('/updateJobStatus', updateJobStatus);

module.exports = router;
