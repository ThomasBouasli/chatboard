import { signInWithPopup } from "firebase/auth";

import Button from "@/components/Button";
import Cursor from "@/components/Cursor";
import { auth, google } from "@/lib/firebase";

const HomePage = () => {
  const handleJoin = () => {
    signInWithPopup(auth, google);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Cursor />
      <h1 className="text-gradient select-none text-9xl font-extrabold uppercase">CHATBOARD™</h1>
      <Button onClick={handleJoin}>Join</Button>
    </main>
  );
};
export default HomePage;
