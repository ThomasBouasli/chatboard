import { signOut } from "firebase/auth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import { auth, db, functions, messaging } from "@/lib/firebase";

const AppPage = () => {
  const [data, setData] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleJoin = () => {
    signOut(auth);
  };

  const signUpForNotifications = async (token: string) => {
    const registerDevice = httpsCallable(functions, "registerDevice");

    await registerDevice({ token });
  };

  const fetchData = async () => {
    onSnapshot(collection(db, "messages"), (snapshot) => {
      const messages: string[] = [];

      snapshot.forEach((doc) => {
        messages.push(doc.data().message);
      });

      setData(messages);
    });
  };

  const postData = async () => {
    await addDoc(collection(db, "messages"), {
      message,
    });

    setMessage("");
  };

  useEffect(() => {
    Notification.requestPermission().then(async (permission) => {
      console.log(permission);
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "BBDYePVlLXaKu9ZtbN0UjNSYum-Z2I_hmBeIXV7xwL29qFkT1uNL0Z4jHOPX3FGxpHkfVDlRuntgSRjHl3-Vvg4",
        });

        signUpForNotifications(token);
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      <header className="sticky left-0 top-0 flex h-16 w-full items-center justify-between border-b border-secondary px-4 py-2">
        <h1 className="text-gradient select-none text-2xl font-extrabold uppercase">App</h1>
        <Button onClick={handleJoin}>Sign Out</Button>
      </header>
      <main className="flex h-full w-full flex-col">
        {data.map((message) => (
          <div className="flex h-16 w-full items-center justify-center border-b border-secondary px-4 py-2">
            <p>{message}</p>
          </div>
        ))}
      </main>
      <footer className="sticky bottom-0 left-0 flex h-16 w-full items-center justify-center border-t border-secondary px-4 py-2">
        <input
          type="text"
          className="w-full border border-text bg-background"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="ml-2" onClick={postData}>
          Send
        </button>
      </footer>
    </div>
  );
};
export default AppPage;
