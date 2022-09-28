const express = require('express');
const router = express.Router();

const controller = require('../../controller/TeamController');

router.post('/insert', controller.insertTeam);
router.put('/update', controller.updateTeam);
router.put('/delete', controller.deleteTeam);
router.post('/add-career', controller.addCareer);
router.put('/delete-career', controller.deleteCareer);
router.put('/update-career', controller.updateCareer);

module.exports = router;