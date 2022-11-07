const express = require('express');
const router = express.Router();

const controller = require('../../controller/BlogController');

router.post('/list', controller.getBlogs);
router.get('/get-youtube-videos', controller.getYoutubeVideos);
router.post('/get-banners', controller.getBanners);

module.exports = router;