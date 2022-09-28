const express = require('express');
const router = express.Router();

const teamRouter = require('../client/teamRouter');
const projectRouter = require('../client/projectRouter');
const blogRouter = require('../client/blogRouter');
const employeeRouter = require('../client/employeeRouter');

router.use('/team', teamRouter);
router.use('/project', projectRouter);
router.use('/blog', blogRouter);
router.use('/employee', employeeRouter);

module.exports = router;