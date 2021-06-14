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

exports.subscribe = functions.region("asia-south1").https.onRequest(main);
exports.minister = functions.region("asia-south1").https.onRequest(main);
exports.cron = functions.region("asia-south1").https.onRequest(main);

// get, post, put, patch, delete
const web = require("./routes/web");

//** Subscriber Routes */ 
app.post("/", web.subscribe);
app.post("/email-push", web.emailPush);

//** Minister Routes */
app.get("/username/:userName", web.username);
app.get("/promoted", web.promoted);
app.get("/trending", web.trending);
app.post("/addMinister", web.addMinister);

//** Cron Routes */
exports.subscribersPush = functions.region("asia-south1")
    .pubsub.schedule('59 23 * * *')
    .timeZone('Asia/Kolkata')
    .onRun((context) => {
        web.subscribersPush
        return null;
    });