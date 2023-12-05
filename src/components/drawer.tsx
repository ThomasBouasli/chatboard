import CanvasInput from "./canvas-input";

import { animated, useSpring } from "@react-spring/web";
import { GripHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

const Drawer = ({ children: _, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [clicking, setClicking] = useState(false);

  const [{ y: py }, api] = useSpring(() => ({
    y: 0,
    config: {
      mass: 1,
      friction: 1,
      bounce: 0.1,
    },
  }));

  const handleDrag = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const handle = handleRef.current!;
      const drawer = drawerRef.current!;

      const maxY = drawer.clientHeight - handle.clientHeight;

      if (!clicking) {
        setDragging(false);
        setClicking(false);
        return;
      }

      const y = window.innerHeight - e.clientY - handle.clientHeight / 2;

      if (y < 0) {
        api.start({ y: 0 });
      } else if (y > maxY) {
        api.start({ y: maxY });
      } else {
        api.start({ y });
      }

      setDragging(true);
    },
    [clicking, api],
  );

  const handleTouchDrag = useCallback(
    (e: TouchEvent) => {
      e.stopPropagation();

      const handle = handleRef.current!;
      const drawer = drawerRef.current!;

      const maxY = drawer.clientHeight - handle.clientHeight;

      if (!clicking) {
        setDragging(false);
        setClicking(false);
        return;
      }

      const y = window.innerHeight - e.touches[0].clientY - handle.clientHeight / 2;

      if (y < 0) {
        api.start({ y: 0 });
      } else if (y > maxY) {
        api.start({ y: maxY });
      } else {
        api.start({ y });
      }

      setDragging(true);
    },
    [clicking, api],
  );

  const handleMouseUp = useCallback(
    (e: PointerEvent | TouchEvent) => {
      const handle = handleRef.current!;
      const drawer = drawerRef.current!;

      const maxY = drawer.clientHeight - handle.clientHeight;

      if (!clicking) {
        setDragging(false);
        setClicking(false);
        return;
      }

      e.stopPropagation();
      if (!dragging) {
        setOpen((prev) => !prev);
        setDragging(false);
        setClicking(false);
        return;
      }

      if (py.get() > maxY / 10) {
        setOpen((prev) => {
          if (!prev) {
            api.start({ y: maxY });
          }
          return false;
        });
      } else if (py.get() < maxY / 10) {
        setOpen((prev) => {
          if (prev) {
            api.start({ y: 0 });
          }
          return true;
        });
      } else if (py.get() > maxY / 2) {
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

      setClicking(false);
    },
    [dragging, py, api, clicking],
  );

  const handleMouseDown = useCallback((e: PointerEvent | TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setClicking(true);
  }, []);

  useEffect(() => {
    const handle = handleRef.current!;

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
  }, [handleRef, handleMouseDown, handleDrag, handleTouchDrag, handleMouseUp]);

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
      className={twMerge("fixed bottom-10 left-1/2  w-full max-w-sm translate-y-full bg-background", className)}
      ref={drawerRef}
      style={{
        y: py.to((v) => `calc(100% - ${v}px)`),
        x: "-50%",
      }}
    >
      <div className="flex h-10 w-full cursor-move items-center justify-center bg-foreground/10 py-1" ref={handleRef}>
        <GripHorizontal className="text-text" />
      </div>
      <div className="border-x-8 border-b-8 border-foreground/10 p-4">
        <CanvasInput onSubmit={() => setOpen(false)} />
      </div>
    </animated.section>
  );
};
export default Drawer;
