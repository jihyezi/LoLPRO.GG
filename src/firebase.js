// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAb6Jj77r6axd8JUoL1hChfiCtnOF73WI",
    authDomain: "lolprogg-ed60f.firebaseapp.com",
    databaseURL: "https://lolprogg-ed60f-default-rtdb.firebaseio.com",
    projectId: "lolprogg-ed60f",
    storageBucket: "lolprogg-ed60f.firebasestorage.app",
    messagingSenderId: "793229653649",
    appId: "1:793229653649:web:d31b2aafb8d7bb2c3af130"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;