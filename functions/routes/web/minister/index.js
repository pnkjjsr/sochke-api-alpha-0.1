exports.username = (req, res) => {
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

exports.promoted = (req, res) => {
  const { db } = require("../../../utils/admin");

  const promotedMinister = [];

  let colRef = db.collection("ministers");
  colRef
    .where("promoted", ">", 0)
    .orderBy("promoted", "asc")
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

exports.trending = (req, res) => {
  const { db } = require("../../../utils/admin");

  let error = null;
  let ministers = {
    mps: [],
    mlas: [],
    councillors: []
  }

  let colRef = db.collection("ministers");
  let transaction = db
    .runTransaction((t) => {
      return t
        .get(colRef)
        .then(() => {
          let trendingMPs = colRef
            .where("type", "==", "MP")
            .where("trending", ">", 0)
            .orderBy("trending", "asc")
            .limit(10)
            .get().then((snapshot) => {
              if (snapshot.empty) return null;

              snapshot.forEach((doc) => {
                ministers.mps.push(doc.data());
              });
            });

          let trendingMLAs = colRef
            .where("type", "==", "MLA")
            .where("trending", ">", 0)
            .orderBy("trending", "asc")
            .limit(10)
            .get().then((snapshot) => {
              if (snapshot.empty) return null;

              snapshot.forEach((doc) => {
                ministers.mlas.push(doc.data());
              });
            });

          let trendingCOUNCILLORs = colRef
            .where("type", "==", "COUNCILLOR")
            .where("trending", ">", 0)
            .orderBy("trending", "asc")
            .limit(10)
            .get().then((snapshot) => {
              if (snapshot.empty) return null;

              snapshot.forEach((doc) => {
                ministers.councillors.push(doc.data());
              });
            });

          return Promise.all([trendingMPs, trendingMLAs, trendingCOUNCILLORs]).catch((err) => {
            error = err;
          });
        })
        .catch((err) => {
          error = err;
        });
    })
    .then(() => {
      return res.status(200).json(ministers);
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
}

exports.addMinister = (req, res) => {
  const { db } = require("../../../utils/admin");

  const data = {
    address: req.body.address,
    age: req.body.age,
    assets: req.body.assets,
    bannerUrl: req.body.bannerUrl,
    cases: req.body.cases,
    constituency: req.body.constituency,
    createdAt: new Date().toISOString(),
    education: req.body.education,
    liabilities: req.body.liabilities,
    name: req.body.name,
    party: req.body.party,
    partyLogo: req.body.partyLogo,
    partyShort: req.body.partyShort,
    photoUrl: req.body.photoUrl,
    pincode: req.body.pincode,
    promoted: req.body.promoted,
    searchTags: req.body.searchTags,
    state: req.body.state,
    twitterHandle: req.body.twitterHandle,
    type: req.body.type,
    userName: req.body.userName,
    winner: req.body.winner,
    year: req.body.year,
  };

  let colRef = db.collection("ministers");

  colRef.where("userName", "==", data.userName).get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        return res.status(400).json({
          code: "minister/duplicate",
          messsage: `${data.userName} already added in database`
        });
      }
      else {
        colRef.add(data).then((ref) => {
          colRef.doc(ref.id).update({ id: ref.id })
            .then(() => {
              return res.status(200).json({
                code: "minister/added",
                message: "New minister added in database",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });

      }
    })
    .catch((err) => {
      return res.status(400).json(err);
    });
}