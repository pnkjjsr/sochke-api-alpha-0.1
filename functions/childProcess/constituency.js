const { googleSheet } = require("../utils/sheet");
const { db } = require("../utils/admin");

process.on("message", data => {
  googleSheet("1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s", data).then(
    sheetData => {
      let colRef = db.collection("constituencies");

      sheetData.map(row => {
        let data = {
          area: row[0],
          pincode: row[1],
          constituency: row[2],
          district: row[3],
          state: row[4]
        };

        colRef
          .where("area", "==", data.area)
          .where("pincode", "==", data.pincode)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              console.log(
                `${data.name}, ${data.constituency}, ${data.state} This constituency already added in database.`
              );
            }

            let docRef = colRef.doc();
            data.id = docRef.id;
            colRef.add(data).then(ref => {
              console.log("Constituency added: ", ref.id, data.area);
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  );
});
