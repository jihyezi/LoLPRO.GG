const admin = require("firebase-admin");

let serviceAccount;
if (process.env.FIREBASE_CONFIG) {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  serviceAccount = require("./lolprogg-ed60f-firebase-adminsdk-1cerz-46615cd137.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lolprogg-ed60f-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
module.exports = db;
