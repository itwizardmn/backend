const express = require('express');
const router = express.Router();

const controller = require('../../controller/TeamController');

router.get('/list', controller.getTeams);
router.post('/get-career', controller.getCareers);

module.exports = router;