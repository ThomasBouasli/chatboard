import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import CanvasDisplay from "@/components/canvas-display";
import { Pen, PenData } from "@/components/tools/pen";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db, functions, messaging } from "@/lib/firebase";

dayjs.extend(relativeTime);

const Feed = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const [data, setData] = useState<
    {
      id: string;
      data: PenData[];
      userName: string;
      userImage: string;
      timestamp: Timestamp;
    }[]
  >([]);

  const signUpForNotifications = async (token: string) => {
    const registerDevice = httpsCallable(functions, "registerDevice");

    await registerDevice({ token });
  };

  const fetchData = async () => {
    const queryRef = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    onSnapshot(queryRef, async (snapshot) => {
      const promises = snapshot.docs.map(async (docRef) => {
        const userRef = await getDoc(doc(db, "users", docRef.data().userId));

        const user = userRef.data();

        return {
          id: docRef.id,
          data: JSON.parse(docRef.data().data),
          userName: user?.username ?? "Unknown",
          userImage: user?.image ?? "https://via.placeholder.com/150",
          timestamp: docRef.data().createdAt,
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
    <main {...props} className={twMerge("mb-5", className)}>
      <div className="flex flex-col">
        {data.map((message) => (
          <div key={message.id} className="flex h-fit w-full items-center justify-center border-secondary px-4 py-2">
            <Card className="w-full max-w-sm overflow-hidden">
              <CardHeader className="border-b border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex w-2/3 items-center gap-4 overflow-hidden">
                    <img src={message.userImage} className="aspect-square h-10 rounded-full" />
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{message.userName}</span>
                  </div>
                  <span className="text-right text-sm text-foreground/50">
                    {dayjs(message.timestamp.toDate()).fromNow()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
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
