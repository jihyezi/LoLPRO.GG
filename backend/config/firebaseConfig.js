const admin = require("firebase-admin");
const serviceAccount = require("./lolprogg-ed60f-firebase-adminsdk-1cerz-87339768d6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lolprogg-ed60f-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
module.exports = db;
