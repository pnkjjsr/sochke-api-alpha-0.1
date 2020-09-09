// Test for Number
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
              message: "Subscriber added in databse successfully.",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return res.json({
          code: "subscriber/repeat",
          message: "This email already subscribed with us.",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });


};
