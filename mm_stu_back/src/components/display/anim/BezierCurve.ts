import { Ref } from "vue";

interface Point {
  x: number,
  y: number
}

export const useBezierCurve = (el: Ref<HTMLCanvasElement | null>) => {
  if(el.value === null) throw new Error("unknow el node");
  const Canvas = el.value;
  const Ctx = Canvas.getContext("2d")!;
  Canvas.width = 400;
  Canvas.height = 400;
  Canvas.style.background = "#edede9";

  const [A , B, C] = [
    {x : 50, y : 50},
    {x : 250, y : 50},
    {x : 50, y : 350}
  ]

  let Exp = 1;
  DrawCir(Ctx, A);  // A (50, 50)
  DrawCir(Ctx, B); // B (250, 50)
  DrawCir(Ctx, C); // C (50, 350)

  const Draw = () => {
    const P1 = BezierFunc(A, B, C, Exp);
    DrawLine(Ctx, P0, P1);
    P0 = P1;
  }
  
  let P0 = BezierFunc(A, B, C, Exp);
  //let UUID = 0;
  const render = () => {
    Exp -= 0.015;
    if(Exp <= 0) return//cancelAnimationFrame(UUID);
    Draw();
    //UUID = requestAnimationFrame(render);
    render()
  }
  render();
  return {}
}

const DrawCir = (ctx : CanvasRenderingContext2D, Point: {x : number , y: number}) => {
  ctx.beginPath();
  ctx.arc(Point.x, Point.y, 5, 0, Math.PI * 2);
  ctx.strokeStyle = "blur";
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

const DrawLine = (ctx : CanvasRenderingContext2D, P0: Point, P1: Point) => {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(P0.x, P0.y);
  ctx.lineTo(P1.x, P1.y);
  ctx.stroke();
  ctx.closePath();
}

const BezierFunc = (P0: Point, P1: Point, P2: Point, exp: number) => {
  // B(t) = (1 - t) ** 2 * P0 + 2t(1 - t) * P1 + t * 2 * P2
  return {
    x: (1 - exp) ** 2 * P0.x + 2 * exp * (1 - exp) * P1.x + exp * exp * P2.x,
    y: (1 - exp) ** 2 * P0.y + 2 * exp * (1 - exp) * P1.y + exp * exp * P2.y,
  }
}