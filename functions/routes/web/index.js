// Open APIs
const { subscribe, emailPush } = require("./subscribe");
const { promoted, username, trending } = require("./minister");

module.exports = {
  // subscribe
  subscribe,
  emailPush,

  // minister
  username,
  promoted,
  trending
};
