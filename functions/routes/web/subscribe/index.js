exports.subscribe = (req, res) => {
  const { db } = require("../../../utils/admin");

  const data = {
    createdAt: new Date().toISOString(),
    email: req.body.email,
    type: req.body.type,
  };

  let colRef = db.collection("subscribers");

  colRef
    .where("email", "==", data.email)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        let docRef = colRef.doc();
        data.id = docRef.id;

        docRef
          .set(data)
          .then(() => {
            return res.status(201).json({
              code: "subscriber/add",
              message: "Subscriber added successfully.",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.json({
          code: "subscriber/repeat",
          message: "This email already subscribed.",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};


exports.emailPush = (req, res) => {
  require('dotenv').config();
  var Mailchimp = require('mailchimp-api-v3');
  var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

  const data = {
    email: req.body.email,
    status: req.body.status,
  };

  mailchimp.post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
    email_address: data.email,
    status: data.status,
  })
    .then((result) => {
      if (result.statusCode === 200) {
        return res.json({
          code: "mailchimp/subscribed",
          message: "Subscriber added in mailchimp audience."
        });
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
}