import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2/options";
import { z } from "zod";

admin.initializeApp();

setGlobalOptions({
  region: "southamerica-east1",
  maxInstances: 10,
});

const db = admin.firestore();
const messaging = admin.messaging();

const onMessageCreatedSchema = z.object({
  message: z.string(),
});

export const onMessageCreated = onDocumentCreated("messages/{messageId}", async (event) => {
  const { message } = onMessageCreatedSchema.parse(event.data?.data());

  const users = await db.collection("users").get();

  const tokens: string[] = users.docs.map((doc) => doc.id);

  for (const token of tokens) {
    await messaging.send({
      token,
      notification: {
        title: "New message",
        body: message,
      },
    });
  }
});

export const registerDevice = onCall(async (req) => {
  const { token } = req.data;

  await db.collection("users").doc(token).set({ active: true });
});
