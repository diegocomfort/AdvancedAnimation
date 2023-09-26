import Mover from "./mover.js";
import Vec2D from "./vec2d.js";

export default class Orbiter {
    private parent: Mover;
    private angle: number;
    private angularVelocity: number;
    private orbtialRadius;
    private radius;

    constructor(
        parent: Mover,
        initialAngle: number = 0,
        angularVelocity: number = 0,
        orbtialRadius: number,
        radius: number
    ) {
        this.parent = parent;
        this.angle = initialAngle;
        this.angularVelocity = angularVelocity;
        this.radius = radius;
        this.orbtialRadius = orbtialRadius;
    }

    public update(deltaTime: number): void {
        this.angle += this.angularVelocity * deltaTime;
    }

    public render(canvas: HTMLCanvasElement, color?: string): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pos = Vec2D.fromAngle(this.angle, this.orbtialRadius).add(this.parent.position);

        ctx.fillStyle = color ?? "black";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
