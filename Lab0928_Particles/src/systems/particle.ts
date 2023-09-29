import System from "../system.js";
import { Color } from "../utils.js";
import Vec2D from "../vec2d.js";
import Body from "./body.js";

export default class Particle extends Body {
    initialTime: number;
    lifeSpan: number;
    originalColor: Color;
    colorEffect?: (percentOfLifetimePast: number, color: Color) => Color;

    constructor(params: {
        radius: number;
        mass?: number;
        position?: Vec2D;
        velocity?: Vec2D;
        acceleration?: Vec2D;
        onWallCollision?: "bounce" | "modulus";
        color?: Color;
        lifeSpan: number;
        colorEffect?: (percentOfLifetimePast: number, color: Color) => Color;
    }) {
        super(params);
        this.initialTime = Date.now();
        this.lifeSpan = params.lifeSpan;
        this.colorEffect = params.colorEffect;
        this.originalColor = this.color;
    }

    update(
        deltaTime: number,
        environment: readonly Readonly<System>[],
        newAcceleration?: Vec2D | undefined
    ): void {
        super.update(deltaTime, environment, this.acceleration);
        if (this.colorEffect)
            this.color = this.colorEffect(
                (Date.now() - this.initialTime) / this.lifeSpan,
                this.originalColor
            );
    }

    applyBehaviors(
        environment: System[],
        envWidth: number,
        envHeight: number
    ): void {
        if (this.initialTime + this.lifeSpan <= Date.now()) {
            environment.splice(environment.indexOf(this), 1);
        }
    }

    render(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d")!;
        ctx.globalAlpha
        super.render(canvas);
    }
}
