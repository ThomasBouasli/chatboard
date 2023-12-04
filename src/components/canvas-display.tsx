import { useCallback, useEffect, useRef, useState } from "react";

import Canvas from "@/components/canvas";
import { Pen } from "@/components/tools/pen";

type CanvasDisplayProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

const CanvasDisplay = ({ data, ...props }: CanvasDisplayProps & { data: Pen[] }) => {
  const [isInView, setIsInView] = useState(false);
  const [seed, setSeed] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvas = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const temp = tempCanvas.current;
    const container = containerRef.current;

    if (!canvas || !container || !temp) return;

    temp.width = container.clientWidth;
    temp.height = container.clientWidth;

    const context = canvas.getContext("2d");
    const tempContext = temp.getContext("2d");

    if (!tempContext || !context) return;

    tempContext.putImageData(context.getImageData(0, 0, canvas.width, canvas.height), 0, 0);

    canvas.style.display = "none";
    temp.style.display = "block";

    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth;

    context.putImageData(tempContext.getImageData(0, 0, temp.width, temp.height), 0, 0);

    canvas.style.display = "block";
    temp.style.display = "none";
  }, [canvasRef, containerRef]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of data) {
      d.render(ctx, canvas.width, seed);
    }
  }, [data, canvasRef, seed]);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setSeed((s) => s + 1);
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isInView]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsInView(entries[0].isIntersecting);
    });

    observer.observe(containerRef.current!);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <Canvas ref={canvasRef} {...props} />
      <Canvas style={{ display: "none" }} ref={tempCanvas} />
    </div>
  );
};
export default CanvasDisplay;
