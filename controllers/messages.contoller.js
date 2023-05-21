
function getMessages(req,res) {
  res.send('<ul><li>Hello Kautilya</li></ui>');
} 

function postMessage(req,res) {
  console.log("Updating messages...");
} 

module.exports = {
  getMessages,
  postMessage,
};