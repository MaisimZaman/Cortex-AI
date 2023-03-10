import * as firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyAHmjTQQMFeMcx6BoTixLPHZJnTW-59U8g",
  authDomain: "cortex-ai.firebaseapp.com",
  projectId: "cortex-ai",
  storageBucket: "cortex-ai.appspot.com",
  messagingSenderId: "951829743937",
  appId: "1:951829743937:web:971b73665370248e9379c0",
  measurementId: "G-ZSY5GN4Q75"
};


let app;


if (firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();

}

const db = app.firestore();
const auth = firebase.auth();

export {db, auth}