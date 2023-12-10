import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ className, ...props }, ref) => {
  return <canvas ref={ref} className={twMerge("aspect-square w-full bg-background", className)} {...props} />;
});

Canvas.displayName = "Canvas";

export default Canvas;
