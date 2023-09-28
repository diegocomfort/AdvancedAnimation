import System from "./system.js";
import Vec2D from "./vec2d.js";
import { mod, TAU } from "./utils.js";

export default class Body implements System {
    position: Vec2D;
    velocity: Vec2D;
    acceleration: Vec2D;
    mass: number;
    radius: number;
    onWallCollision: "bounce" | "modulus";
    color: string;

    constructor(params: {
        radius: number;
        mass?: number;
        position?: Vec2D;
        velocity?: Vec2D;
        acceleration?: Vec2D;
        onWallCollision?: "bounce" | "modulus";
        color?: string;
    }) {
        this.radius = params.radius;
        this.mass = params.mass ?? Math.PI * this.radius ** 2;
        this.position = params.position ?? new Vec2D();
        this.velocity = params.velocity ?? new Vec2D();
        this.acceleration = params.acceleration ?? new Vec2D();
        this.onWallCollision = params.onWallCollision ?? "bounce";
        this.color = params.color ?? "black";
    }

    update(
        deltaTime: number,
        environment: ReadonlyArray<Readonly<System>>,
        newAcceleration?: Vec2D
    ): void {
        const newAcc = newAcceleration ?? new Vec2D();

        this.position = this.position
            .add(this.velocity.mult(deltaTime))
            .add(this.acceleration.mult(deltaTime ** 2 * 0.5));
        this.velocity = this.velocity.add(
            this.acceleration.add(newAcc).mult(deltaTime * 0.5)
        );
        this.acceleration = newAcc;
    }

    applyForces(systems?: System[], forces?: Vec2D[]): Vec2D {
        const systemInteractions = systems ?? [];
        const forceInteractions = forces ?? [];

        const G = 6.6743e-11;

        // Force
        let f = new Vec2D();
        for (const system of systemInteractions) {
            if (this !== system)
                f = f.add(
                    system.position
                        .sub(this.position)
                        .setMagnitude(
                            (G * system.mass * this.mass) /
                                this.position.dist(system.position) ** 2
                        )
                );
        }

        for (const force of forceInteractions) {
            f = f.add(force);
        }

        return f.div(this.mass);
    }

    applyBehaviors(environment: Array<System>, envWidth: number, envHeight: number): void {
        if (this.onWallCollision === "modulus") {
            this.position = this.position
                .setX((x) => mod(x, envWidth))
                .setY((y) => mod(y, envHeight));
            return;
        }

        if (this.position.x - this.radius < 0) {
            this.position = this.position.setX((x) => this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        } else if (this.position.x + this.radius > envWidth) {
            this.position = this.position.setX((x) => envWidth - this.radius);
            this.velocity = this.velocity.setX((x) => -x);
        }
        if (this.position.y - this.radius < 0) {
            this.position = this.position.setY((y) => this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        } else if (this.position.y + this.radius > envHeight) {
            this.position = this.position.setY((y) => envHeight - this.radius);
            this.velocity = this.velocity.setY((y) => -y);
        }
    }

    render(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, TAU);
        ctx.fill();
    }
}
