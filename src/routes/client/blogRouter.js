const express = require('express');
const router = express.Router();

const controller = require('../../controller/BlogController');

router.post('/list', controller.getBlogs);

module.exports = router;