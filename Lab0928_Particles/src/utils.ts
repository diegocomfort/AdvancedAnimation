export function resizeCanvas(canvas: HTMLCanvasElement) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
}

export function mod(a: number, b: number): number {
    return a - b * Math.floor(a / b);
}

export const TAU = Math.PI * 2;