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

exports.subscribersPush = (req, res) => {
  const ChildProcess = require("child_process");
  const SubscribersPushCron = ChildProcess.fork("./childProcess/subscribersPush.js");

  const { db } = require("../../../utils/admin");
  const { isEmail } = require("../../../utils/validation");

  let error = null;
  let emails = [];

  let colUsers = db.collection("users");
  let colSubscribers = db.collection("subscribers");

  let transaction = db
    .runTransaction((t) => {
      return t
        .get(colUsers, colSubscribers)
        .then(() => {

          let subscribers = colSubscribers
            .where("email", "!=", "")
            .get()
            .then((snapshot) => {
              if (snapshot.empty) return console.log("Subscribers data not loading.");

              snapshot.forEach((doc) => {
                let data = doc.data();

                if (!isEmail(data.email)) {
                  // @TODO: 8th March 2021 | email incorrect debugging
                  return
                }

                emails.push(data.email);
              });
            })


          let users = colUsers
            .where("email", "!=", "")
            .get()
            .then((snapshot) => {
              if (snapshot.empty) return console.log("Subscribers data not loading.");

              snapshot.forEach((doc) => {
                let data = doc.data();

                if (!isEmail(data.email)) {
                  // @TODO: 8th March 2021 | email incorrect debugging
                  return
                }

                emails.push(data.email);
              });
            });

          return Promise.all([subscribers, users])
            .catch((err) => {
              error = err;
            });
        })
        .catch((err) => {
          error = err;
        });
    })
    .then(() => {
      SubscribersPushCron.send(emails);

      return res.status(200).send({
        code: "subscribers-cron/running",
        message: "Subscribers cron run successfully."
      });
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
}