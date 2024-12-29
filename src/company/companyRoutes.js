const express = require('express');
const {login} = require('./companyController');

const router = express.Router();

router.post('/login', login);

module.exports = router;
