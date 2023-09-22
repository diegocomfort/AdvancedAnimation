import Mover from "./mover.js";
import Vec2D from "./vec2d.js";

export default class CelestialSystem {
    private parent_: Mover;
    private satellites_: Mover[];

    constructor(
        parent: Mover,
        satellites: {
            amount?: number;
            radius?: number;
            mass?: number;
            orbitalRadius?: number;
        }
    ) {
        const amount = satellites.amount ?? 4;
        const radius = satellites.radius ?? 20;
        const orbitalRadius = satellites.orbitalRadius ?? 100;
        const mass = satellites.mass ?? Math.PI * radius ** 2;

        this.parent_ = parent;
        this.satellites_ = new Array<Mover>(amount);
        for (let i = 0; i < amount; ++i) {
            const G = 6.6743e-11;
            const TAU = Math.PI * 2;

            const speed = Math.sqrt((G * parent.mass) / orbitalRadius);

            const theta = (i * TAU) / amount;

            const pos = this.parent_.position.add(
                Vec2D.fromAngle(theta, orbitalRadius)
            );
            const vel = Vec2D.fromAngle(theta + Math.PI / 2, speed).add(
                parent.velocity
            );

            this.satellites_[i] = new Mover({
                mass: mass,
                radius: radius,
                position: pos,
                velocity: vel,
                acceleration: parent.acceleration,
            });
        }
    }

    public get numSatellites(): number {
        return this.satellites_.length;
    }

    public update(deltaTime: number, otherMovers?: Mover[], otherForces?: Vec2D[]): void {
        this.parent_.update(deltaTime);
        for (const satellite of this.satellites_) {
            const movers = [this.parent_, ...this.satellites_];
            if (otherMovers) movers.push(...otherMovers);

            const forces: Vec2D[] = [];
            if (otherForces) forces.push(...otherForces)

            satellite.update(deltaTime, satellite.applyForces(movers, forces    ));
        }
    }

    public render(
        canvas: HTMLCanvasElement,
        colors?: {
            parent?: string | (() => string);
            satellites?: (theta: number, index: number) => string;
        }
    ): void {
        const parentCLR = colors
            ? colors.parent
                ? typeof colors.parent == "string"
                    ? colors.parent
                    : colors.parent()
                : "black"
            : "black";

        this.parent_.render(canvas, parentCLR);
        for (let i = 0; i < this.satellites_.length; ++i) {
            const satellite = this.satellites_[i];
            const clr = colors
                ? colors.satellites
                    ? typeof colors.satellites == "string"
                        ? colors.satellites
                        : colors.satellites(
                              satellite.position
                                  .sub(this.parent_.position)
                                  .angle(),
                              i
                          )
                    : "black"
                : "black";

            satellite.render(canvas, clr);
        }
    }
}
