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

        this.body1.color = this.body2.color = "pink";
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

        // TODO: keep together
    }

    applyBehaviors(environment: System[], envWidth: number, envHeight: number): void {
        this.body1.applyBehaviors(environment, envWidth, envHeight);
        this.body2.applyBehaviors(environment, envWidth, envHeight);

        // TODO: What behaviors?
    }

    render(canvas: HTMLCanvasElement): void {
        this.body1.render(canvas);
        this.body2.render(canvas);

        // TODO: render the link
    }
}
