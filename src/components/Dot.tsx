import { forwardRef } from "react";

type DotProps = {
  className?: string;
};

const Dot = forwardRef<HTMLDivElement, DotProps>(({ className }, ref) => {
  return <div ref={ref} className={`gradient pointer-events-none h-40 w-40 rounded-full ${className}`} />;
});

Dot.displayName = "Dot";

export default Dot;
