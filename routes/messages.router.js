const express = require('express');
const messagesController = require('../controllers/messages.contoller');

const messagesRouter = express.Router();
 
messagesRouter.get("/",messagesController.getMessages)
messagesRouter.post("/",messagesController.postMessage)

module.exports = messagesRouter;