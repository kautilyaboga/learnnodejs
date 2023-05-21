const express = require('express');
const friendsController = require('../controllers/friends.contoller');


const friendsRouter = express.Router();

friendsRouter.use((req,res,next)=>{
  console.log(`IP Address : ${req.ip}`);
  next()
})

friendsRouter.post("/",friendsController?.postFriend)
friendsRouter.get('/',friendsController?.getFriends)
friendsRouter.get('/:friendId',friendsController?.getIndividualFriend)

module.exports = friendsRouter;