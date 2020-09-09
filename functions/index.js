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

exports.api = functions.region("asia-east2").https.onRequest(main);
//** Routes */
const web = require("./routes/web");
app.post("/subscribe", web.subscribe);