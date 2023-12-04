import { signInWithPopup } from "firebase/auth";

import Cursor from "@/components/cursor";
import { Button } from "@/components/ui/button";
import { auth, google } from "@/lib/firebase";

const HomePage = () => {
  const handleJoin = () => {
    signInWithPopup(auth, google);
  };

  return (
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4">
      <Cursor />
      <h1 className="text-gradient select-none text-5xl font-extrabold uppercase sm:text-7xl md:text-8xl lg:text-9xl">
        CHATBOARD™
      </h1>
      <Button onClick={handleJoin}>Join</Button>
    </main>
  );
};
export default HomePage;
