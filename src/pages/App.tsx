import { signOut } from "firebase/auth";

import Button from "@/components/Button";
import { auth } from "@/lib/firebase";

const AppPage = () => {
  const handleJoin = () => {
    signOut(auth);
  };
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <h1 className="text-gradient select-none text-9xl font-extrabold uppercase">App</h1>
      <Button onClick={handleJoin}>Leave</Button>
    </main>
  );
};
export default AppPage;
