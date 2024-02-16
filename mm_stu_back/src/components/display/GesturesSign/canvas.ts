export interface Point {
  x: number;
  y: number;
}

export interface IcanvasRenderEngine {
  drawLine: (start: Point, end: Point, color?: string) => void;
}

export interface IcanvasEngine extends IcanvasRenderEngine {
  loop: () => void;
  setTast: (fn: () => void) => void;
  clear: () => void;
  setConfig: (_defaultColor: string) => void;
  initConfig: () => void;
}

export const canvasEngine = (ctx: CanvasRenderingContext2D): IcanvasEngine => {

  let defaultColor = "#007aff";

  const renderTask: (() => void)[] = [];

  const setConfig = (_defaultColor : string) => {
    defaultColor = _defaultColor;
  }

  const initConfig = () => {
    defaultColor = "#007aff";
  }

  const clear = () => ctx.clearRect(0, 0, 300, 300);

  const loop = () => {
    clear();
    task();
  }

  const task = () => renderTask.forEach( fn => fn() );

  const drawLine = (start: Point, end: Point, color?: string) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color ?? defaultColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
  }

  const setTast = (fn: () => void) => {
    renderTask.push(fn);
  }

  return {
    drawLine, setTast, loop, clear, setConfig, initConfig
  }
}