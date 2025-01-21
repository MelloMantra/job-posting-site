/* to clarify the role of this file:
This is a router (and controller.js is a controller) for both users and companies, for stuff that is common to both.
company/ and user/ are the folders for the controllers and routers specific to companies and users.
*/
const express = require('express');
const router = express.Router();

const { logout, getJob, searchCategory, searchJobs } = require('./controller');

router.get('/logout', logout);
router.get('/getJob/:jobId', getJob);
router.get('/searchCategory/:itemType', searchCategory);
router.get('/searchJobs', searchJobs);

module.exports = router;