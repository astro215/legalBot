import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Import necessary Firebase Auth modules
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCXjsYzhIPmZ4F8xDQM95ToWaoKOVFS11g",
  authDomain: "nlplegalbot.firebaseapp.com",
  databaseURL: "https://nlplegalbot-default-rtdb.firebaseio.com",
  projectId: "nlplegalbot",
  storageBucket: "nlplegalbot.appspot.com",
  messagingSenderId: "551040834771",
  appId: "1:551040834771:web:5e7955bfb2ab25f4094826"
};




const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), // Set persistence to AsyncStorage
});
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export { firebaseApp, auth, db , storage};