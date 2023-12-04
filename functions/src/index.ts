import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";

admin.initializeApp();

setGlobalOptions({
  region: "southamerica-east1",
  maxInstances: 10,
});

const db = admin.firestore();
const messaging = admin.messaging();

export const onMessageCreated = onDocumentCreated("messages/{messageId}", async () => {
  const users = await db.collection("tokens").get();

  const tokens: string[] = users.docs.map((doc) => doc.id);

  for (const token of tokens) {
    await messaging.send({
      token,
      notification: {
        title: "New message",
      },
    });
  }
});

export const registerDevice = onCall(async (req) => {
  const { token } = req.data;

  await db.collection("tokens").doc(token).set({ active: true });
});

export const onUserSignUp = functions.auth.user().onCreate(async (data) => {
  await db
    .collection("users")
    .doc(data.uid)
    .set({
      username: data?.displayName ?? "Anonymous",
      image: data.photoURL ?? "https://picsum.photos/200",
    });
});
