const fs = require("fs");
const { google } = require("googleapis");

exports.googleSheet = (code, data) => {
  return new Promise((resolve, reject) => {
    const sheetCode = code;
    const sheetType = data.sheetType;
    const sheetRange = data.sheetRange;

    // If modifying these scopes, delete token.json.
    const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    // https://sochke-api.firebaseapp.com/__/auth/handler?code=4/swFoh6fED6MpNyHt2AgoxmMmMPH_mMVsEiojGf0_vRrTQds4Yh2E_6eCiZlg0eccQ6wVupWua8hxuzz5h2r_qpg&scope=https://www.googleapis.com/auth/spreadsheets.readonly
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = "token.json";

    // Load client secrets from a local file.
    fs.readFile("credentials.json", (err, content) => {
      if (err) return console.log("Error loading client secret file:", err);
      // Authorize a client with credentials, then call the Google Sheets API.
      authorize(JSON.parse(content), sheetData);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
      const { client_secret, client_id, redirect_uris } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
      });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
      });

      let sheetAuthCode =
        "4/vwER0HLryo3zfDaRgyGjFAmAhO88JwDXytbgjvsES9MkT2_bT8DNGXJpOxCW04Bdg5mOWft0PPLI6aRG_LhsBlM";

      if (!sheetAuthCode) {
        return console.log(
          "Authorize this app by visiting this url and update the VAR: sheetAuthCode, above this console.log",
          authUrl
        );
      }

      oAuth2Client.getToken(sheetAuthCode, (err, token) => {
        if (err)
          return console.error(
            "Error while trying to retrieve access token",
            err
          );
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    }

    /**
     * Get data from sheet
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} Gauth The authenticated Google OAuth client.
     */
    function sheetData(auth) {
      const sheets = google.sheets({
        version: "v4",
        auth
      });
      sheets.spreadsheets.values.get(
        {
          spreadsheetId: sheetCode,
          range: `${sheetType}!${sheetRange}`
        },
        (err, res) => {
          if (err) return console.log("The API returned an error: " + err);
          let rows = res.data.values;
          resolve(rows);
        }
      );
    }
  });
};
