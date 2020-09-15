const functions = require("firebase-functions");
const app = require("express")();
const main = require("express")();
const cors = require("cors");

const { checkIfAuthenticated } = require("./utils/middlewareFirebseJWT");

//** Main Express API setting */
main.use(cors());
main.use(app);
app.use(checkIfAuthenticated);
//** ======================================================== */

exports.subscribe = functions.region("asia-east2").https.onRequest(main);

// get, post, put, patch, delete
//** Subscriber Routes */ 
const web = require("./routes/web");
app.post("/", web.subscribe);
app.post("/email-push", web.emailPush);