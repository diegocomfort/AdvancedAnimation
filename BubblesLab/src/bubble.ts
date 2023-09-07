import Vec2D from "./vec2d.js";

export type UpdateCallback = (bubble: Bubble) => void;

export default class Bubble {
    private radius: number;
    private pos: Vec2D;
    private vel: Vec2D;
    private acc: Vec2D;
    private overlapping: boolean = false;
    private color: string;

    constructor(radius: number,
                pos: Vec2D = new Vec2D(), 
                vel: Vec2D = new Vec2D(), 
                acc: Vec2D = new Vec2D(),
                color: string = "black") {
        this.radius = radius;
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.color = color;
    }

    update(updateFunction: UpdateCallback) {
        updateFunction(this);
    }

    static UPDATE_POS = (bubble: Bubble): void => {
        bubble.vel = bubble.vel.add(bubble.acc);
        bubble.pos = bubble.pos.add(bubble.vel);
    }

    static CHECK_WALLS = (width: number, height: number): UpdateCallback => {
        return (bubble: Bubble): void => {
            if (bubble.pos.x - bubble.radius < 0) {
                bubble.pos = new Vec2D(0, bubble.pos.y);
                bubble.vel = new Vec2D(-bubble.vel.x, bubble.vel.y);
            }else if (bubble.pos.x + bubble.radius > width) {
                bubble.pos = new Vec2D(width, bubble.pos.y);
                bubble.vel = new Vec2D(-bubble.vel.x, bubble.vel.y);
            }
            if (bubble.pos.y - bubble.radius < 0) {
                bubble.pos = new Vec2D(bubble.pos.x, 0);
                bubble.vel = new Vec2D(bubble.vel.x, -bubble.vel.y);
            } else if (bubble.pos.y + bubble.radius > height) {
                bubble.pos = new Vec2D(bubble.pos.x, height);
                bubble.vel = new Vec2D(bubble.vel.x, -bubble.vel.y);
            }
        };
    }

    static SET_OVERLAPPING_TRUE = (bubble: Bubble): void => {
        bubble.overlapping = true;
    }

    static SET_OVERLAPPING_FALSE = (bubble: Bubble): void => {
        bubble.overlapping = false;
    }
    static SET_COLOR = (color: string): UpdateCallback => {
        return (bubble: Bubble): void => {
            bubble.color = color;
        }
    }

    render(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
    }

    isOverlapping(bubble: Bubble): boolean {
        return this.pos.dist(bubble.pos) <= this.radius + bubble.radius;
    }
}