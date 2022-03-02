import admin from "../firebase/nodeApp";
import "firebase/database";
import { connectDatabaseEmulator } from "firebase/database";

export const getProfileData = async (username) => {
  const db = admin.firestore();

  const profileCollection = db.collection("profile");
  const profileDoc = await profileCollection.doc(username).get();

  if (!profileDoc.exists) {
    return null;
  }

  return profileDoc.data();
};
