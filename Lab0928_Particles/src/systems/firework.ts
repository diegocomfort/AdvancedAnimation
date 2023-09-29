import System from "../system.js";
import { Color, TAU } from "../utils.js";
import Vec2D from "../vec2d.js";
import Body from "./body.js";
import Particle from "./particle.js";

const g = 10;

export default class Firework extends Body {
    detonationHeight: number;

    constructor(params: {
        position: Vec2D;
        detonationHeight: number;
        color: Color;
    }) {
        super({ radius: 10, color: params.color, position: params.position });
        this.detonationHeight = params.detonationHeight;

        this.velocity = Vec2D.J.mult(-250);
    }

    update(
        deltaTime: number,
        environment: readonly Readonly<System>[],
        newAcceleration?: Vec2D | undefined
    ): void {
        super.update(deltaTime, environment);
    }

    applyBehaviors(
        environment: System[],
        envWidth: number,
        envHeight: number
    ): void {
        if (this.position.y <= this.detonationHeight) {
            const index = environment.indexOf(this);
            if (index === -1) {
                console.log("firework not in ev");
                return;
            }

            environment.splice(index, 1);

            const layers = 100;
            const particlesPerLayer = 20;
            const dTheta = TAU / particlesPerLayer;
            for (let j = 0; j < particlesPerLayer; ++j) {
                for (let i = 0; i < layers; ++i) {
                    const deviation = Math.random() - 0.5;
                    environment.push(
                        new Particle({
                            radius: 5,
                            lifeSpan: 3 * 1000,
                            colorEffect: (p, c) =>
                                c.setA(p > 0.9 ? 1 - 10 * (p - 0.9) : 1),
                            position: this.position,
                            velocity: Vec2D.fromAngle(dTheta * (j + deviation), 50 + i),
                            acceleration: Vec2D.J.mult(25),
                            color: this.color
                        })
                    );
                }
            }            
        }
        
    }
}
