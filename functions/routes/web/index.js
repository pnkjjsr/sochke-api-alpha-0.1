// Open APIs
const { subscribe, emailPush, subscribersPush } = require("./subscribe");
const { promoted, username, trending } = require("./minister");

module.exports = {
  // subscribe
  subscribe,
  emailPush,
  subscribersPush,

  // minister
  username,
  promoted,
  trending
};
