import { signOut } from "firebase/auth";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

const AppHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <header
      {...props}
      className={twMerge(
        "sticky left-0 top-0 h-16 w-full border-b border-secondary bg-background px-4 py-2",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-sm items-center justify-between">
        <h1 className="text-gradient select-none text-2xl font-extrabold uppercase underline">Chatboard</h1>
        <Button onClick={() => signOut(auth)}>Sign Out</Button>
      </div>
    </header>
  );
};
export default AppHeader;
