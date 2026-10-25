import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKjHEtcfldE9ZcBBxdcEkMy2YrdypOGko",
  authDomain: "califncoapp-7e0d8.firebaseapp.com",
  projectId: "califncoapp-7e0d8",
  storageBucket: "califncoapp-7e0d8.firebasestorage.app",
  messagingSenderId: "292835863489",
  appId: "1:292835863489:web:57fcb05be70459a43c5d40"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
