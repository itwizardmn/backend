const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const teamRouter = require('./teamRouter');
const projectRouter = require('./projectRouter');
const blogRouter = require('./blogRouter');

router.use('/', userRouter);
router.use('/team', teamRouter);
router.use('/project', projectRouter);
router.use('/blog', blogRouter);

module.exports = router;