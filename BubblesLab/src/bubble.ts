import Vec2D from "./vec2d";

export type VectorCallback = (pos: Vec2D, vel: Vec2D, acc: Vec2D) => [pos: Vec2D, vel: Vec2D, acc: Vec2D];

export default class Bubble {
    private radius: number;
    private pos: Vec2D;
    private vel: Vec2D;
    private acc: Vec2D;
    private isOverlapping: boolean = false;
    private color: (isOverlapping: boolean) => string;

    constructor(radius: number,
                pos: Vec2D = new Vec2D(), 
                vel: Vec2D = new Vec2D(), 
                acc: Vec2D = new Vec2D(),
                color: (isOverlapping: boolean) => string = (isOverlapping) => isOverlapping ? "white": "black") {
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.color = color;
    }

    update(updateFunction: VectorCallback) {
        [this.pos, this.vel, this.acc] = updateFunction(this.pos, this.vel, this.acc);
    }

    static UPDATE_POS = (pos: Vec2D, vel: Vec2D, acc: Vec2D): [pos: Vec2D, vel: Vec2D, acc: Vec2D] => {
        vel = vel.add(acc);
        pos = pos.add(vel);
        return [pos, vel, acc];
    }

    static CHECK_WALLS = (width: number, height: number): VectorCallback => {
        return (pos: Vec2D, vel: Vec2D, acc: Vec2D): [pos: Vec2D, vel: Vec2D, acc: Vec2D] => {
            if (pos.x < 0) {
                pos = new Vec2D(0, pos.y);
                vel = new Vec2D(-vel.x, vel.y);
            }else if (pos.x > width) {
                pos = new Vec2D(width, pos.y);
                vel = new Vec2D(-vel.x, vel.y);
            }
            if (pos.y < 0) {
                pos = new Vec2D(pos.x, 0);
                vel = new Vec2D(vel.x, -vel.y);
            } else if (pos.y > height) {
                pos = new Vec2D(pos.x, height);
                vel = new Vec2D(vel.x, -vel.y);
            }
            return [pos, vel, acc];
        };
    }

    render(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color(this.isOverlapping);
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
    }

}