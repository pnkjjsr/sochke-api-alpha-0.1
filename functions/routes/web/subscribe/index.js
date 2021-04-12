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

  let emails = [];
  let colSubscribers = db.collection("subscribers");

  let date = new Date();
  let cronDate = date.toLocaleDateString('en-IN', { timeZone: "Asia/Calcutta" });

  console.log(`Cron run today at: ${date}`);
  colSubscribers.orderBy("createdAt", "desc").get().then((snapshot) => {
    if (snapshot.empty) return console.log("Subscribers data not loading.");

    snapshot.forEach((doc) => {
      let data = doc.data();
      let createdAt = new Date(data.createdAt).toLocaleDateString('en-IN', { timeZone: "Asia/Calcutta" });

      if (cronDate == createdAt) {
        if (!isEmail(data.email)) {
          // @TODO: 8th March 2021 | email incorrect debugging
          return
        }

        emails.push(data.email);
      }
    });

    emails.length > 0 ? SubscribersPushCron.send(emails) : console.log(`No new subscribers today: ${cronDate}`);
  }).catch((err) => {
    return console.log(err);
  });

  // return res.status(200).send({
  //   code: "subscribers-cron/running",
  //   message: "Subscribers cron run successfully."
  // });
}
