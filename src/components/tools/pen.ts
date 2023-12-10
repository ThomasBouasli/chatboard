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

  onMouseDown(event: PointerEvent, width: number): void {
    const canvas = event.target as HTMLCanvasElement;
    canvas.setPointerCapture(event.pointerId);

    this.data = {
      x: event.offsetX / width,
      y: event.offsetY / width,
      width: 0,
      height: 0,
      points: [[event.offsetX / width, event.offsetY / width, event.pressure]],
    };
  }

  onMouseMove(event: PointerEvent, width: number): void {
    if (!this.data) return;

    this.data.width = Math.max(this.data.width, event.offsetX - this.data.x);
    this.data.height = Math.max(this.data.height, event.offsetY - this.data.y);

    this.data.points.push([event.offsetX / width, event.offsetY / width, event.pressure]);
  }

  render(ctx: CanvasRenderingContext2D, width: number, seed?: number | null): void {
    if (!this.data) return;

    const { points } = this.data;

    const stroke = getStroke(
      points.map((data) => {
        if (seed) {
          return [
            data[0] * width + Math.cos(seed * 0.1 * data[0] * width) * 1,
            data[1] * width + Math.sin(seed * 0.1 * data[1] * width) * 1,
            data[2],
          ];
        } else {
          return [data[0] * width, data[1] * width, data[2]];
        }
      }),
      {
        size: width / 120,
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
