import { animated, useSpring } from "@react-spring/web";
import { GripHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const Drawer = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [{ y: py }, api] = useSpring(() => ({
    y: 0,
    config: {
      mass: 1,
      friction: 1,
      bounce: 0.1,
    },
  }));

  useEffect(() => {
    const handle = handleRef.current!;
    const drawer = drawerRef.current!;

    const maxY = drawer.clientHeight - handle.clientHeight;

    const handleDrag = (e: PointerEvent) => {
      if (!dragging) return;

      const y = window.innerHeight - e.clientY - handle.clientHeight / 2;

      if (y < 0) {
        api.start({ y: 0 });
      } else if (y > maxY) {
        api.start({ y: maxY });
      } else {
        api.start({ y });
      }
    };

    const handleTouchDrag = (e: TouchEvent) => {
      if (!dragging) return;

      const y = window.innerHeight - e.touches[0].clientY - handle.clientHeight / 2;

      if (y < 0) {
        api.start({ y: 0 });
      } else if (y > maxY) {
        api.start({ y: maxY });
      } else {
        api.start({ y });
      }
    };

    const handleMouseUp = () => {
      if (!dragging) return;

      setDragging(false);

      if (py.get() > maxY / 2) {
        setOpen((prev) => {
          if (prev) {
            api.start({ y: maxY });
          }
          return true;
        });
      } else {
        setOpen((prev) => {
          if (!prev) {
            api.start({ y: 0 });
          }
          return false;
        });
      }
    };

    const handleMouseDown = () => {
      setDragging(true);
    };

    handle.addEventListener("pointerdown", handleMouseDown);
    handle.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("pointermove", handleDrag);
    window.addEventListener("touchmove", handleTouchDrag);
    window.addEventListener("pointerup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      handle.removeEventListener("pointerdown", handleMouseDown);
      handle.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("pointermove", handleDrag);
      window.removeEventListener("touchmove", handleTouchDrag);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging, py, api]);

  useEffect(() => {
    if (open) {
      api.start({ y: drawerRef.current!.clientHeight - handleRef.current!.clientHeight });
    } else {
      api.start({ y: 0 });
    }
  }, [open, api]);

  return (
    <animated.section
      {...props}
      id="drawer"
      className={twMerge("fixed bottom-5 left-1/2  w-full max-w-sm translate-y-full bg-background", className)}
      ref={drawerRef}
      style={{
        y: py.to((v) => `calc(100% - ${v}px)`),
        x: "-50%",
      }}
    >
      <div
        className="flex h-5 w-full cursor-move items-center justify-center rounded-t-lg bg-foreground/30 py-1"
        ref={handleRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <GripHorizontal className="text-text" />
      </div>
      <div className="border-x-8 border-b-8 border-foreground/30 p-4">{children}</div>
    </animated.section>
  );
};
export default Drawer;
