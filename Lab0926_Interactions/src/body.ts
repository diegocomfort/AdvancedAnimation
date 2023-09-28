import System from "./system.js";
import Vec2D from "./vec2d.js";

export default class Body implements System {
    position: Vec2D;
    velocity: Vec2D;
    acceleration: Vec2D;
    mass: number;
    radius: number;

    constructor(params: {
        radius: number;
        mass?: number;
        position?: Vec2D;
        velocity?: Vec2D;
        acceleration?: Vec2D;
    }) {
        this.radius = params.radius;
        this.mass = params.mass ?? Math.PI * this.radius ** 2;
        this.position = params.position ?? new Vec2D();
        this.velocity = params.velocity ?? new Vec2D();
        this.acceleration = params.acceleration ?? new Vec2D();
    }

    update(
        deltaTime: number,
        environment: ReadonlyArray<Readonly<System>>,
        envWidth: number,
        envHeight: number
    ): void {
        // TODO:
    }

    applyBehaviors(environment: Array<System>): void {
        // TODO:
    }

    render(canvas: HTMLCanvasElement): void {
        // TODO:
    }
}
