const express = require('express');
const router = express.Router();

const controller = require('../../controller/BlogController');

router.post('/list', controller.getBlogs);
router.get('/get-youtube-videos', controller.getYoutubeVideos);

module.exports = router;