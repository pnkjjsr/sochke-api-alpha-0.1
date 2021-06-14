// Open APIs
const { subscribe, emailPush, subscribersPush } = require("./subscribe");
const { promoted, username, trending, addMinister } = require("./minister");

module.exports = {
  // subscribe
  subscribe,
  emailPush,
  subscribersPush,

  // minister
  username,
  promoted,
  trending,
  addMinister
};
