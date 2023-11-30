import Button from "@/components/Button";
import Cursor from "@/components/Cursor";

const HomePage = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Cursor />
      <h1 className="text-gradient text-9xl font-extrabold uppercase">CHATBOARD™</h1>
      <Button>Join</Button>
    </main>
  );
};
export default HomePage;
