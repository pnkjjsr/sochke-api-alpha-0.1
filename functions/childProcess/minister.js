const { googleSheet } = require("../utils/sheet");
const { db } = require("../utils/admin");
const { createTagArr } = require("../routes/crons/utils");

process.on("message", data => {
  googleSheet("1sgh4yVQ2gEIKmMBFuSq-eUDt4MFV0tklnz322-d_G3s", data).then(
    sheetData => {
      let colRef = db.collection("ministers");
      sheetData.map(minister => {
        let winnerBoolen = false;
        if (minister[2] == "TRUE") winnerBoolen = true;

        let ministerUserName = `${minister[0].replace(/ /g, "-")}-${
          minister[4]
        }-${minister[6]}-${minister[3]}`;

        let searchTagsArr = createTagArr(minister[0]);

        let data = {
          createdAt: new Date().toISOString(),
          name: minister[0],
          constituency: minister[1],
          winner: winnerBoolen,
          year: parseInt(minister[3]) || "",
          type: minister[4] || "",
          party: minister[5] || "",
          partyShort: minister[6] || "",
          assets: minister[7] || "",
          liabilities: minister[8] || "",
          cases: minister[9] || "",
          age: minister[10] || "",
          education: minister[11] || "",
          address: minister[12] || "",
          state: minister[13] || "",
          pincode: minister[14] || "",
          photoUrl: minister[15] || "",
          userName: ministerUserName,
          voteTrueCount: 0,
          voteFalseCount: 0,
          believerCount: 0,
          searchTags: searchTagsArr
        };

        colRef
          .where("constituency", "==", data.constituency)
          .where("party", "==", data.party)
          .where("year", "==", data.year)
          .get()
          .then(snapshot => {
            if (!snapshot.empty) {
              console.log(
                `${data.party}, ${data.constituency}, ${data.year} This Constituency already had minister.`
              );
            } else {
              let docRef = colRef.doc();
              data.id = docRef.id;
              colRef
                .doc(data.id)
                .set(data)
                .then(ref => {
                  // console.log("Added document with ID: ", data.id, data.name);
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  );
});
