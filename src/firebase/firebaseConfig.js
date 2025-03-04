// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/*const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};*/

const firebaseConfig = {

    apiKey: "AIzaSyCowUcpHPa0WnFLXsv0HA91-VegvufpVBM",
  
    authDomain: "scoutjar-f8c19.firebaseapp.com",
  
    projectId: "scoutjar-f8c19",
  
    storageBucket: "scoutjar-f8c19.firebasestorage.app",
  
    messagingSenderId: "421158064503",
  
    appId: "1:421158064503:web:40e1ae26a42aa7b3abd172",
  
    measurementId: "G-HJ96B2RN4R"
  
  };
  

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
