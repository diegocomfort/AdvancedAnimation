export function resizeCanvas(canvas: HTMLCanvasElement) {
    const pxRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;
}

export function mod(a: number, b: number): number {
    return a - b * Math.floor(a / b);
}

export const TAU = Math.PI * 2;

export class Color {
    r: number;
    g: number;
    b: number;
    a: number

    constructor(r?: number, g?: number, b?: number, a?: number) {
        this.r = r ?? 0;
        this.g = g ?? 0;
        this.b = b ?? 0;
        this.a = a ?? 1;
    }

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}