const express = require('express');

const plantesRouter = express.Router();

plantesRouter.get("/planets",getAllPlanets)