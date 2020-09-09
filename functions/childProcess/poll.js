const { googleSheet } = require("../utils/sheet");
const { db } = require("../utils/admin");

process.on("message", data => {
  googleSheet("1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s", data).then(
    sheeetData => {
      let colRef = db.collection("polls");

      sheeetData.map(row => {
        let data = {
          createdAt: new Date().toISOString(),
          question: row[0],
          type: row[1],
          pincode: row[2],
          constituency: row[3],
          district: row[4],
          state: row[5],
          country: row[6],
          voteTrueCount: 0,
          voteFalseCount: 0
        };

        let docRef = colRef.doc();
        data.id = docRef.id;
        colRef
          .doc(data.id)
          .set(data)
          .then(ref => {
            console.log("Poll added: ", data.id);
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  );
});
