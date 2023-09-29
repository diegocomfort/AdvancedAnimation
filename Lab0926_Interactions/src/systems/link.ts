import System from "../system.js";
import Vec2D from "../vec2d.js";
import Body from "./body.js";

export default class Link implements System {
    body1: Body;
    body2: Body;
    distance: number;
    color: string

    constructor(body1: Body, body2: Body, distance: number, color?: string) {
        this.body1 = body1;
        this.body2 = body2;
        this.distance = distance;
        this.color = color ?? "black";
    }

    get position(): Vec2D {
        return this.body1.position.add(this.body2.position).div(2);
    }

    get mass(): number {
        return this.body1.mass + this.body2.mass;
    }

    update(deltaTime: number, environment: readonly Readonly<System>[]): void {
        this.body1.update(deltaTime, environment);
        this.body2.update(deltaTime, environment);

        const actualDist = this.body1.position.dist(this.body2.position);
        const delta = this.distance - actualDist;
        const halfDistance = this.body1.position.sub(this.body2.position).setMagnitude(delta / 2);

        this.body1.position = this.body1.position.add(halfDistance);
        this.body2.position = this.body2.position.sub(halfDistance);
    }

    applyBehaviors(environment: System[], envWidth: number, envHeight: number): void {
        this.body1.applyBehaviors(environment, envWidth, envHeight);
        this.body2.applyBehaviors(environment, envWidth, envHeight);
    }

    render(canvas: HTMLCanvasElement): void {
        this.body1.render(canvas);
        this.body2.render(canvas);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(this.body1.position.x, this.body1.position.y);
        ctx.lineTo(this.body2.position.x, this.body2.position.y);
        ctx.stroke();
    }
}
