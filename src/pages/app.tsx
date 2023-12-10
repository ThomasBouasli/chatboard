import { GripHorizontal } from "lucide-react";
import { Drawer, useDrawer } from "react-headless-drawer";

import AppHeader from "@/components/app-header";
import CanvasInput from "@/components/canvas-input";
import Feed from "@/components/feed";

const AppPage = () => {
  const drawer = useDrawer({
    position: "bottom",
  });

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden" ref={drawer.containerRef}>
      <Drawer.Provider {...drawer}>
        <AppHeader className="h-16" />
        <Feed className="min-h-[100dvh] overflow-auto" />
        <Drawer.Root className="absolute bottom-0 left-0 w-full bg-background">
          <Drawer.Handle className="absolute bottom-full flex h-10 w-full cursor-pointer items-center justify-center bg-accent py-1">
            <GripHorizontal />
          </Drawer.Handle>
          <Drawer.Content className="border-x-8 border-b-8 border-accent p-4">
            <CanvasInput />
          </Drawer.Content>
        </Drawer.Root>
      </Drawer.Provider>
    </div>
  );
};
export default AppPage;
