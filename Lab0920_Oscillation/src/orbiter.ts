import Mover from "./mover.js";
import Vec2D from "./vec2d.js";

export default class BinaryCelestialSystem {
    private parent_: Mover;
    private satellites_: Mover[];

    constructor(
        parent: Mover,
        satellites: {
            amount?: number;
            radius?: number;
            distance?: number;
        }
    ) {
        const amount = satellites.amount ?? 4;
        const radius = satellites.radius ?? 20;
        const distance = satellites.distance ?? 100;

        this.parent_ = parent;
        this.satellites_ = new Array<Mover>(amount);
        for (let i = 0; i < amount; ++i) {
            const G = 1//6.6743e-11;
            const TAU = Math.PI * 2;

            const mass = Math.PI * radius ** 2;

            const speed = Math.sqrt((G * parent.mass) / distance);

            console.log(speed)

            const theta = (i * TAU) / amount;

            const pos = this.parent_.position.add(Vec2D.fromAngle(theta, distance));
            const vel = Vec2D.fromAngle(theta, speed);

            this.satellites_[i] = new Mover({
                radius: radius,
                position: pos,
                velocity: vel,
            });
        }
    }

    public update(deltaTime: number): void {
        this.parent_.update(deltaTime);
        for (const satellite of this.satellites_) {
            satellite.update(deltaTime, satellite.applyForces([this.parent_]));
            
            if (satellite == this.satellites_[0])
                console.log(satellite.position);
        }
    }

    public render(canvas: HTMLCanvasElement): void {
        this.parent_.render(canvas);
        for (const satellite of this.satellites_) satellite.render(canvas);
    }
}
