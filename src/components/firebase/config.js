import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase, push, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC8Qqx4vsFCRuqUu6OIzZG4M8AVbh8Edrs",
    authDomain: "course-noti.firebaseapp.com",
    databaseURL: "https://course-noti-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "course-noti",
    storageBucket: "course-noti.firebasestorage.app",
    messagingSenderId: "352740762544",
    appId: "1:352740762544:web:4d1f0aa9e2ed968e972c75",
    measurementId: "G-87V0ZF2E0H"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage };

export const sendNotification = async (lecturerId, message) => {
  try {
    const notifRef = ref(db, `notifications/${lecturerId}`);
    const newNotifRef = push(notifRef);
    await set(newNotifRef, {
      message,
      createdAt: Date.now(),
      seen: false
    });
    console.log("Notification sent to:", lecturerId);
  } catch (err) {
    console.error("Failed to sending notification: ", err);
  }
};
