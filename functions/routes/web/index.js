// Open APIs
const { subscribe, emailPush } = require("./subscribe");
const { promoted, minister } = require("./minister");

module.exports = {
  // subscribe
  subscribe,
  emailPush,

  // minister
  promoted,
  minister
};
