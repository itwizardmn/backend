const express = require('express');
const router = express.Router();

const controller = require('../../controller/UserController');

router.post('/login', controller.login);
router.post('/update-status-resume', controller.changeStatusResume);
router.post('/update-profession', controller.updateProfession);
router.post('/add-profession', controller.addProfession);
router.delete('/delete-profession', controller.deleteProfession);
router.put('/delete-employee',  controller.deleteEmployee);
router.put('/update-employee', controller.updateEmployee);

module.exports = router;