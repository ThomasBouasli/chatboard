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

    document.addEventListener("pointermove", handleMouseMove);

    return () => {
      document.removeEventListener("pointermove", handleMouseMove);
    };
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
