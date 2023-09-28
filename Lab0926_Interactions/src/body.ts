import System from "./system.js";
import Vec2D from "./vec2d.js";

export default class Body implements System{
    private _position: Vec2D;
    private _velocity: Vec2D;
    private _acceleration: Vec2D;
    private _mass: number;
    private _radius: number;

    public get position(): Vec2D {
        return this._position;
    }

    public get velocity(): Vec2D {
        return this._velocity;
    }

    public get acceleration(): Vec2D {
        return this._acceleration;
    }

    public get mass(): number {
        return this._mass;
    }

    public get radius(): number {
        return this._radius;
    }

    constructor(params: {
        radius: number;
        mass?: number;
        position?: Vec2D;
        velocity?: Vec2D;
        acceleration?: Vec2D;
    }) {
        this._radius = params.radius;
        this._mass = params.mass ?? Math.PI * this._radius ** 2;
        this._position = params.position ?? new Vec2D();
        this._velocity = params.velocity ?? new Vec2D();
        this._acceleration = params.acceleration ?? new Vec2D();
    }

    update(
        deltaTime: number,
        environment: ReadonlyArray<Readonly<System>>,
        envWidth: number,
        envHeight: number,
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
