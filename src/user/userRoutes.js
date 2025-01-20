const express = require('express');
const { upload, uploadResume, downloadResume, login, signUp, applyToJob, deleteApplication, getApplications } = require('./userController');

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.post('/uploadResume', upload.single('pdf'), uploadResume);
router.get('/downloadResume', downloadResume);
router.post('/applyToJob/:jobId', applyToJob);
router.post('/deleteApplication/:applicationId', deleteApplication);
router.get('/getApplications', getApplications);

router.post('/upload-resume', upload.single('resume'), uploadResume);

module.exports = router;