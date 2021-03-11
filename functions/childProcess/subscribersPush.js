require('dotenv').config();

process.on("message", data => {
  data.map(email => {
    var Mailchimp = require('mailchimp-api-v3');
    var mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

    mailchimp.post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
      email_address: email,
      status: "subscribed",
    })
      .then((result) => {
        if (result.statusCode === 200) {
          //@TODO: 8th March 20201 | Successful debuging
        }
      })
      .catch((err) => {
        //@TODO: 8th March 20201 | Fail debuging
      });
  });
});
