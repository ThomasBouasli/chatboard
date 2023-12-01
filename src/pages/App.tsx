import { signOut } from "firebase/auth";

import Button from "@/components/Button";
import { auth } from "@/lib/firebase";

const AppPage = () => {
  const handleJoin = () => {
    signOut(auth);
  };
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center">
      <header className="sticky left-0 top-0 flex h-16 w-full items-center justify-between border-b border-secondary px-4 py-2">
        <h1 className="text-gradient select-none text-2xl font-extrabold uppercase">App</h1>
        <Button onClick={handleJoin}>Sign Out</Button>
      </header>
      <main className="flex h-full w-full flex-col"></main>
    </div>
  );
};
export default AppPage;
