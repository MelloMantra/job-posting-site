/* to clarify the role of this file:
This is a router (and controller.js is a controller) for both users and companies, for stuff that is common to both.
company/ and user/ are the folders for the controllers and routers specific to companies and users.
*/
const express = require('express');
const router = express.Router();

const { logout, getJob, searchOccupations } = require('./controller');

router.get('/logout', logout);
router.get('/getJob/:jobId', getJob);
router.get('/searchOccupations/:itemType', searchOccupations)

module.exports = router;