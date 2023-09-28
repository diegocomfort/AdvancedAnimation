import Body from "./body.js";
import System from "../system.js";
import { TAU } from "../utils.js";
import Vec2D from "../vec2d.js";

export default class BodyWithSatellites extends Body {
    angle: number;
    angularVelocity: number;
    amountOfSatellites: number;
    orbitalRadius: number;
    satelliteRadius: number;
    satelliteColor: string;

    constructor(
        bodyParams: {
            radius: number;
            mass?: number;
            position?: Vec2D;
            velocity?: Vec2D;
            acceleration?: Vec2D;
            onWallCollision?: "bounce" | "modulus";
            color?: string;
        },
        satelliteParams: {
            radius: number;
            initialAngle?: number;
            angularVelocity?: number;
            amount?: number;
            orbitalRadius?: number;
            color?: string;
        }
    ) {
        super(bodyParams);

        this.angle = satelliteParams.initialAngle ?? 0;
        this.angularVelocity = satelliteParams.angularVelocity ?? 0;
        this.satelliteRadius = satelliteParams.radius;
        this.orbitalRadius = satelliteParams.orbitalRadius ?? this.radius * 2;
        this.amountOfSatellites = satelliteParams.amount ?? 1;
        this.satelliteColor = satelliteParams.color ?? this.color;
    }

    update(
        deltaTime: number,
        environment: readonly Readonly<System>[],
        newAcceleration?: Vec2D | undefined
    ): void {
        super.update(deltaTime, environment);

        this.angle += this.angularVelocity * deltaTime;
    }

    render(canvas: HTMLCanvasElement): void {
        super.render(canvas);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const deltaTheta = TAU / this.amountOfSatellites;
        ctx.fillStyle = this.satelliteColor;
        
        for (let i = 0; i < this.amountOfSatellites; ++i) {
            const pos = this.position.add(
                Vec2D.fromAngle(i * deltaTheta + this.angle, this.orbitalRadius)
            );
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.satelliteRadius, 0, TAU);
            ctx.fill();
        }
        
    }
}
