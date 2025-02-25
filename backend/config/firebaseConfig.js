require("dotenv").config();
const admin = require("firebase-admin");

// let serviceAccount;
// if (process.env.FIREBASE_CONFIG) {
//   serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
// } else {
//   serviceAccount = require("./lolprogg-ed60f-firebase-adminsdk-1cerz-46615cd137.json");
// }

const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://lolprogg-ed60f-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
module.exports = db;
