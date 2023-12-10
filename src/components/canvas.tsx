import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ className, ...props }, ref) => {
  return (
    <canvas
      ref={ref}
      className={twMerge("aspect-square w-full bg-background", className)}
      height={512}
      width={512}
      {...props}
    />
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
