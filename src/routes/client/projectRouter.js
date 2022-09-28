const express = require('express');
const router = express.Router();

const controller = require('../../controller/ProjectController');

router.get('/list', controller.getProjectsByTeam);

module.exports = router;