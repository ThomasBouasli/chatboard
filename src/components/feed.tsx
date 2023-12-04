import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import CanvasDisplay from "@/components/canvas-display";
import { Pen, PenData } from "@/components/tools/pen";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db, functions, messaging } from "@/lib/firebase";

const Feed = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const [data, setData] = useState<
    {
      id: string;
      data: PenData[];
      userName: string;
      userImage: string;
    }[]
  >([]);

  const signUpForNotifications = async (token: string) => {
    const registerDevice = httpsCallable(functions, "registerDevice");

    await registerDevice({ token });
  };

  const fetchData = async () => {
    onSnapshot(collection(db, "messages"), async (snapshot) => {
      const promises = snapshot.docs.map(async (docRef) => {
        const userRef = await getDoc(doc(db, "users", docRef.data().userId));

        const user = userRef.data();

        return {
          id: docRef.id,
          data: JSON.parse(docRef.data().data),
          userName: user?.username ?? "Unknown",
          userImage: user?.image ?? "https://via.placeholder.com/150",
        };
      });

      const messages = await Promise.all(promises);

      setData(messages);
    });
  };

  useEffect(() => {
    Notification.requestPermission().then(async (permission) => {
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
    <main {...props} className={twMerge("mb-5 flex w-full", className)}>
      <div className="flex flex-col">
        {data.map((message) => (
          <div
            key={message.id}
            className="flex h-fit w-full items-center justify-center border-b border-secondary px-4 py-2"
          >
            <Card>
              <CardHeader className="border-b border-border">
                <div className="flex items-center gap-4">
                  <img src={message.userImage} className="aspect-square h-10 rounded-full" />
                  <span>{message.userName}</span>
                </div>
              </CardHeader>
              <CardContent>
                <CanvasDisplay key={message.id} data={message.data.map((d) => new Pen(d))} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
};
export default Feed;
