const express = require('express');
const router = express.Router();

const controller = require('../../controller/ProjectController');
const fileUpload = require('../../middleware/FileUpload');

router.post('/insert', fileUpload.uploadProfilePic(), controller.insertProject);
router.post('/get-list', controller.getLists);
router.post('/update-photo', fileUpload.uploadProfilePic(), controller.updatePhoto);
router.post('/update-property', controller.updateProperty);
router.delete('/delete', controller.deleteProject);

module.exports = router;