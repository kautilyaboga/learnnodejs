const express = require('express');
const {httpGetAllLaunches, httpPostLaunch, httpRemoveLaunch} = require('./launches.controller')

const launchesRouter = express.Router();

launchesRouter.get("/",httpGetAllLaunches);
launchesRouter.post('/',httpPostLaunch);
launchesRouter.delete('/:id',httpRemoveLaunch);

module.exports = launchesRouter;