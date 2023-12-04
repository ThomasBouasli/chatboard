import CanvasInput from "@/components/canvas-input";
import Drawer from "@/components/drawer";

const AppFooter = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Drawer {...props}>
      <CanvasInput />
    </Drawer>
  );
};
export default AppFooter;
