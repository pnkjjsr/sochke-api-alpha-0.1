const { admin } = require("./admin");

const xAccessToken = "k1g45jk145j";

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }

  next();
};

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    let authToken = req.headers["authorization"];
    let X_ACCESS_TOKEN = req.headers["x-access-token"];

    if (xAccessToken == X_ACCESS_TOKEN) return next();

    try {
      await admin
        .auth()
        .verifyIdToken(authToken)
        .then(res => {
          req.authId = res.user_id;
          return next();
        });
    } catch (e) {
      return res.status(401).send({
        status: "fail",
        code: "auth/fail",
        error: "You are not authorized to make this request"
      });
    }
  });
};

module.exports = {
  checkIfAuthenticated
};
