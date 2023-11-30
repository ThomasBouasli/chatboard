import { useEffect, useRef } from "react";

const Cursor = () => {
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
        cursorRef.current.style.top = `${(((event.beta ?? 1) + 90) * window.innerHeight) / 360}px`;
        cursorRef.current.style.left = `${(((event.alpha ?? 1) - 0) * window.innerWidth) / 360}px`;
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
  }, []);

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
      <div
        ref={cursorRef}
        className="gradient pointer-events-none absolute h-40 w-40 translate-x-[-50%] translate-y-[-50%] rounded-full mix-blend-difference"
      />
    </div>
  );
};
export default Cursor;
