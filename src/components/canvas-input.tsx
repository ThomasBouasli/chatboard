import { addDoc, collection, Timestamp } from "firebase/firestore";
import { Trash2, Undo } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import Canvas from "@/components/canvas";
import { Pen } from "@/components/tools/pen";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";

const CanvasInput = ({ onSubmit }: { onSubmit: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tempCanvas = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<null | Pen[]>(null);

  const clear = () => {
    setData([]);
  };

  const saveCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    await addDoc(collection(db, "messages"), {
      userId: auth.currentUser!.uid,
      data: JSON.stringify(data?.map((d) => d.toJSON())),
      createdAt: Timestamp.now(),
    });

    clear();
    onSubmit();
  };

  const undo = useCallback(() => {
    setData((prev) => {
      if (!prev) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  const undoHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        undo();
      }
    },
    [undo],
  );

  const handleMouseDown = useCallback(
    (e: PointerEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const tool = new Pen();
      tool.onMouseDown(e, canvas.clientWidth);

      setData((prev) => {
        if (!prev) return [tool];
        return [...prev, tool];
      });
    },
    [setData],
  );

  const handleMouseMove = useCallback(
    (e: PointerEvent) => {
      const canvas = canvasRef.current;

      if (e.buttons !== 1) return;
      if (!data) return;
      if (!canvas) return;

      const tool = data[data.length - 1];

      if (!tool) return;

      tool.onMouseMove(e, canvas.clientWidth);

      setData((prev) => {
        if (!prev) return prev;

        const newData = [...prev];

        newData[newData.length - 1] = tool;

        return newData;
      });
    },
    [data, setData],
  );

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
    document.addEventListener("keydown", (e) => {
      undoHandler(e);
    });

    return () => {
      document.removeEventListener("keydown", (e) => {
        undoHandler(e);
      });
    };
  }, [undoHandler]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.addEventListener("pointermove", handleMouseMove);

    return () => {
      canvas.removeEventListener("pointermove", handleMouseMove);
    };
  }, [canvasRef, handleMouseDown, handleMouseMove]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.addEventListener("pointerdown", handleMouseDown);

    return () => {
      canvas.removeEventListener("pointerdown", handleMouseDown);
    };
  }, [canvasRef, handleMouseDown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!data) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of data) {
      d.render(ctx, canvas.width);
    }
  }, [data, canvasRef]);

  return (
    <div className="flex flex-col gap-4" ref={containerRef}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-foreground/50">draw something</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={clear}>
            <Trash2 />
          </Button>
          <Button variant="outline" onClick={undo}>
            <Undo />
          </Button>
        </div>
      </div>
      <Canvas className="cursor-crosshair touch-none border border-secondary" ref={canvasRef} />
      <Canvas className="border border-secondary" style={{ display: "none" }} ref={tempCanvas} />
      <Button className="font-bold" onClick={saveCanvas}>
        Save
      </Button>
    </div>
  );
};
export default CanvasInput;
