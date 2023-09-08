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

    static VERLET_UPDATE = (deltaTime: number, newAccelaration: Vec2D = new Vec2D()): UpdateCallback => {
        return (bubble: Bubble): void => {
            // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
            bubble.pos = bubble.pos
                                .add(bubble.vel.mult(deltaTime))
                                .add(bubble.acc.mult(deltaTime ** 2 * 0.5));
            bubble.vel = bubble.vel
                                .add(bubble.acc.add(newAccelaration).mult(deltaTime * 0.5));
            bubble.acc = newAccelaration;
        }
    }

    static CHECK_WALLS = (width: number, height: number): UpdateCallback => {
        return (bubble: Bubble): void => {
            if (bubble.pos.x - bubble.radius < 0) {
                bubble.pos = bubble.pos.setX((x) => bubble.radius);
                bubble.vel = bubble.vel.setX((x) => -x);
            }else if (bubble.pos.x + bubble.radius > width) {
                bubble.pos = bubble.pos.setX((x) => width - bubble.radius);
                bubble.vel = bubble.vel.setX((x) => -x);
            }
            if (bubble.pos.y - bubble.radius < 0) {
                bubble.pos = bubble.pos.setY((y) => bubble.radius);
                bubble.vel = bubble.vel.setY((y) => -y);
            } else if (bubble.pos.y + bubble.radius > height) {
                bubble.pos = bubble.pos.setY((y) => height - bubble.radius)
                bubble.vel = bubble.vel.setY((y) => -y);
            }
        };
    }

    static CHECK_OVERLAP = (otherBubbles: Array<Bubble>, overlapColor: string): UpdateCallback => {
        return (bubble: Bubble): void =>  {
            if (bubble.overlapping) return;
            for (const b of otherBubbles) {
                if (b === bubble) continue;
                if (bubble.pos.dist(b.pos) <= bubble.radius + b.radius) {
                    bubble.overlapping = b.overlapping = true;
                    bubble.color = b.color = overlapColor;
                }
            }
        }
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
        if (!ctx) {
            console.log("Could not retrieve a \'2d\' context from ", canvas);
            return;
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    isOverlapping(bubble: Bubble): boolean {
        return this.pos.dist(bubble.pos) <= this.radius + bubble.radius;
    }
}