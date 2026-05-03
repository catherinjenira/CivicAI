import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAc-zyZxTa64YQjH6mNU6BKuZT74SMwNg",
  authDomain: "dbms-projects-e5f7d.firebaseapp.com",
  databaseURL: "https://dbms-projects-e5f7d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dbms-projects-e5f7d",
  storageBucket: "dbms-projects-e5f7d.firebasestorage.app",
  messagingSenderId: "467167991972",
  appId: "1:467167991972:web:c0db2adae9fd303a382e31",
  measurementId: "G-2DG1P07E2V"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
