const friends = require('../models/friends.model')
// const model = require('../models/friends.model')

function getFriends(req, res) {
  res.json(friends);
}

function getIndividualFriend(req, res) {
  const friendId = Number(req.params.friendId);
  const friend = friends[friendId];

  if (!friend) {
    // res.sendStatus(404)
    res
      .status(404)
      .json({
        error: `Error. No Friend Found with ID : ${req.params.friendId}`,
      });
    return;
  }

  res.status(200).json(friend);
}

function postFriend(req, res) {
  if (!req.body.name) {
    res.status(400).json({
      error: "No Friend Name Found",
    });
    return;
  }

  const newFriend = {
    id: friends?.length,
    name: req.body.name,
  };

  friends.push(newFriend);
  res.json(newFriend);
}

module.exports ={
  getFriends,
  getIndividualFriend,
  postFriend
}
