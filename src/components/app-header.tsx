import { signOut } from "firebase/auth";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

const AppHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <header
      {...props}
      className={twMerge(
        "sticky left-0 top-0 flex h-16 w-full items-center justify-between border-b border-secondary bg-background px-4 py-2",
        className,
      )}
    >
      <h1 className="text-gradient select-none text-2xl font-extrabold uppercase">App</h1>
      <Button onClick={() => signOut(auth)}>Sign Out</Button>
    </header>
  );
};
export default AppHeader;