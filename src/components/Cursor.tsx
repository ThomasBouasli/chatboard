import { useEffect, useRef, useState } from "react";

const Cursor = () => {
  const [start, setStart] = useState<number>();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: PointerEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.top = `${event.clientY}px`;
        cursorRef.current.style.left = `${event.clientX}px`;
      }
    };

    const handleDeviceMove = (event: DeviceOrientationEvent) => {
      if (cursorRef.current) {
        if (!start) {
          setStart(event.alpha!);
        } else {
          const diff = event.alpha! - start;

          console.log({ start, alpha: event.alpha, diff });

          cursorRef.current.style.left = `${diff * (window.innerWidth / 90)}px`;
        }
      }
    };

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints;

    if (!isTouchDevice) {
      document.addEventListener("pointermove", handleMouseMove);

      return () => {
        document.removeEventListener("pointermove", handleMouseMove);
      };
    } else {
      window.addEventListener("deviceorientation", handleDeviceMove);

      return () => {
        window.removeEventListener("deviceorientation", handleDeviceMove);
      };
    }
  }, [cursorRef, start]);

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
      <div
        ref={cursorRef}
        className="gradient pointer-events-none absolute top-1/2 h-40 w-40 translate-x-[-50%] translate-y-[-50%] rounded-full mix-blend-difference"
      />
    </div>
  );
};
export default Cursor;
