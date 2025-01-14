const express = require('express');
const {login, signUp, postJob, getJobs, deleteJob, updateJobStatus, getApplications, makeDecision, downloadResume, } = require('./companyController');

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/postJob', postJob);
router.get('/getJobs', getJobs);
router.post('/deleteJob/:jobId', deleteJob);
router.post('/updateJobStatus/:jobId', updateJobStatus);
router.get('/getApplications/:jobId', getApplications);
router.post('/makeDecision', makeDecision);
router.get('/downloadResume/:jobId/:applicationId', downloadResume);


module.exports = router;
