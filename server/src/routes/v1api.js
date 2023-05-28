const express = require('express')

const planetsRouter = require('./planets/planets.router')
const launchesRouter = require('./launches/launches.router')

const v1api = express.Router();
v1api.use('/planets',planetsRouter);
v1api.use('/launches',launchesRouter);

module.exports = v1api;