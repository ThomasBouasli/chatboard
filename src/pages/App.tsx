import { signOut } from "firebase/auth";

import Button from "@/components/Button";
import { auth } from "@/lib/firebase";

const AppPage = () => {
  const handleJoin = () => {
    signOut(auth);
  };
  return (
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center gap-4">
      <h1 className="text-gradient select-none text-5xl font-extrabold uppercase sm:text-7xl md:text-8xl lg:text-9xl">
        App
      </h1>
      <Button onClick={handleJoin}>Leave</Button>
    </main>
  );
};
export default AppPage;
