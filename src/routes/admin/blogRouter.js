const express = require('express');
const router = express.Router();

const controller = require('../../controller/BlogController');
const fileUpload = require('../../middleware/FileUpload');

router.post('/insert', fileUpload.uploadSingle(), controller.insertBlog);
router.put('/remove', controller.remove);

module.exports = router;