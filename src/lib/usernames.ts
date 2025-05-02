import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export const claimUsername = async (uid: string, username: string) => {
  const usernameRef = doc(firestore, "usernames", username.toLowerCase());
  const usernameSnap = await getDoc(usernameRef);

  if (usernameSnap.exists()) {
    throw new Error("Username already taken");
  }

  await setDoc(usernameRef, {
    uid: uid,
  });

  console.log("✅ Username claimed");
};
