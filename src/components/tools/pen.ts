import getStroke from "perfect-freehand";

export type PenData = {
  x: number;
  y: number;
  height: number;
  width: number;
  points: [number, number, number][];
};

export class Pen {
  private data: PenData | undefined;

  constructor(data?: PenData) {
    this.data = data;
  }

  onMouseDown(event: PointerEvent): void {
    const canvas = event.target as HTMLCanvasElement;
    canvas.setPointerCapture(event.pointerId);

    this.data = {
      x: event.offsetX,
      y: event.offsetY,
      width: 0,
      height: 0,
      points: [[event.offsetX, event.offsetY, event.pressure]],
    };
  }

  onMouseMove(event: PointerEvent): void {
    if (!this.data) return;

    this.data.width = Math.max(this.data.width, event.offsetX - this.data.x);
    this.data.height = Math.max(this.data.height, event.offsetY - this.data.y);

    this.data.points.push([event.offsetX, event.offsetY, event.pressure]);
  }

  render(ctx: CanvasRenderingContext2D, seed?: number | null): void {
    if (!this.data) return;

    const { points } = this.data;

    const stroke = getStroke(
      points.map((data) => {
        if (seed) {
          return [
            data[0] + Math.cos(seed * 0.1 * data[0]) * 1.2,
            data[1] + Math.sin(seed * 0.1 * data[1]) * 1.2,
            data[2],
          ];
        } else {
          return [data[0], data[1], data[2]];
        }
      }),
      {
        size: 4,
        thinning: 0.6,
        smoothing: 0,
        streamline: 0.5, // suavizador
        easing: (t) => t,
        last: true,
        simulatePressure: true,
      },
    );

    ctx.beginPath();
    for (let i = 0; i < stroke.length; i++) {
      const [x, y] = stroke[i];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  toJSON(): PenData | undefined {
    return this.data;
  }
}
