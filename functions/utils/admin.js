const admin = require("firebase-admin");
const functions = require("firebase-functions");
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sochke-dev.firebaseio.com"
});
// admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true
});

module.exports = {
  admin,
  db
};
