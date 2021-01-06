exports.promoted = (req, res) => {
  const { db } = require("../../../utils/admin");

  const promotedMinister = [];

  let colRef = db.collection("ministers");
  colRef
    .where("promoted", "==", true)
    .orderBy("createdAt", "desc")
    .limit(10)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.json({
          code: "minister/empty",
          message: "No data is available.",
        });
      } else {
        snapshot.forEach((doc) => {
          promotedMinister.push(doc.data());
        });
      }
    })
    .then(() => {
      return res.json(promotedMinister);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};


exports.minister = (req, res) => {
  const { db } = require("../../../utils/admin");

  let data = {
    userName: req.params.userName
  }

  const minister = [];

  let colRef = db.collection("ministers");
  colRef
    .where("userName", "==", data.userName)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.json({
          code: "minister/empty",
          message: "No data is available.",
        });
      } else {
        snapshot.forEach((doc) => {
          minister.push(doc.data());
        });
      }
    })
    .then(() => {
      return res.json(minister);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
};