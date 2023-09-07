import Vec2D from "./vec2d.js";
import Bubble from "./bubble.js";

window.addEventListener('load', init);

function resiveCanvas(canvas: HTMLCanvasElement) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
}

function init() {
    const canvas = window.document.querySelector('canvas')!;
    resiveCanvas(canvas);
    window.addEventListener('resize', () => resiveCanvas(canvas));
    const ctx = canvas.getContext("2d");
    
    const width = canvas.width, height = canvas.height, scale = width / 1920;
    const bubbles = Array<Bubble>(200);
    for (let i = 0; i < 200; ++i) {
        const pos = new Vec2D(Math.random() * width, Math.random() * height),
              vel = new Vec2D((Math.random() - 0.5) * 10 * scale, (Math.random() - 0.5) * 10 * scale),
              acc = new Vec2D(); // TODO:
    }
}