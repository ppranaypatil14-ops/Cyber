import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMNt4zJ7UZsPiThy5MF4oPPBjXzKRbFfE",
  authDomain: "cyber-11676.firebaseapp.com",
  databaseURL: "https://cyber-11676-default-rtdb.firebaseio.com",
  projectId: "cyber-11676",
  storageBucket: "cyber-11676.firebasestorage.app",
  messagingSenderId: "266449840701",
  appId: "1:266449840701:web:62715c42e44ebba15cd854",
  measurementId: "G-D99BVFKZTS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
