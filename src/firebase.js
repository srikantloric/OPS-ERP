import firebase from "firebase";
import "firebase/firestore";
import "firebase/remote-config";

const app = firebase.initializeApp({
  apiKey: "AIzaSyAaPYVd2N7YepVt3RPj1d6CtXKaHuw0pt4",
  authDomain: "orient-public-school-prod.firebaseapp.com",
  projectId: "orient-public-school-prod",
  storageBucket: "orient-public-school-prod.appspot.com",
  messagingSenderId: "995813385072",
  appId: "1:995813385072:web:280e2f800cd216d589e5b5",
  measurementId: "G-DP1MLS115J"
});

export const auth = app.auth();
export const storageRef = firebase.storage().ref();

export const remoteConfig = firebase.remoteConfig();
export const db = firebase.firestore();

export default firebase;
