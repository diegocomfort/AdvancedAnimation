import Vec2D from "./vec2d";

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

    const vec = new Vec2D();
}