import Vec2D from "./vec2d.js";
import { mod } from "./utils.js";

export default class Mover {
    private position_: Vec2D;
    private velocity_: Vec2D;
    private acceleration_: Vec2D;
    private radius_: number;
    private mass_: number;
    private connections: Mover[] = [];
    private orbiters: Orbiter[] = [];

    // public get position(): Vec2D {
    //     return this.position_;
    // }

    public get velocity(): Vec2D {
        return this.velocity_;
    }

    public get acceleration(): Vec2D {
        return this.acceleration_;
    }

    public get radius(): number {
        return this.radius_;
    }

    public get mass(): number {
        return this.mass_;
    }

    constructor(options: {
        position?: Vec2D;
        velocity?: Vec2D;
        acceleration?: Vec2D;
        radius: number;
        mass?: number;
        orbiters?: {
            amount?: number;
            color?: string;
            orbitalRadius: number;
            angularVelocity: number;
            radius: number;
        };
    }) {
        this.position_ = options.position ?? new Vec2D();
        this.velocity_ = options.velocity ?? new Vec2D();
        this.acceleration_ = options.acceleration ?? new Vec2D();
        this.radius_ = options.radius;
        this.mass_ = options.mass ?? Math.PI * this.radius_ ** 2;

        if (options.orbiters) {
            const amount = options.orbiters.amount ?? 1;
            for (let i = 0; i < amount; ++i) {
                this.orbiters.push(
                    new Orbiter(
                        this,
                        ((Math.PI * 2) / amount) * i,
                        options.orbiters.angularVelocity,
                        options.orbiters.orbitalRadius,
                        options.orbiters.radius
                    )
                );
            }
        }
    }

    public update(
        deltaTime: number,
        newAcceleration: Vec2D = new Vec2D()
    ): void {
        // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
        this.position_ = this.position_
            .add(this.velocity_.mult(deltaTime))
            .add(this.acceleration_.mult(deltaTime ** 2 * 0.5));
        this.velocity_ = this.velocity_.add(
            this.acceleration_.add(newAcceleration).mult(deltaTime * 0.5)
        );
        this.acceleration_ = newAcceleration;

        for (const orbiter of this.orbiters) {
            orbiter.update(deltaTime);
        }
    }

    public applyForces(movers: Mover[], forces?: Vec2D[]): Vec2D {
        const G = 6.6743e-11;

        // Force
        let f = new Vec2D();
        for (const mover of movers) {
            if (this !== mover)
                f = f.add(
                    mover.position_
                        .sub(this.position_)
                        .setMagnitude(
                            (G * mover.mass * this.mass) /
                                this.position_.dist(mover.position_) ** 2
                        )
                );
        }

        if (forces) for (const force of forces) f = f.add(force);

        // F = ma -> a = F/m
        return f.div(this.mass);
    }

    public checkWalls(
        width: number,
        height: number,
        bounce: boolean = true
    ): void {
        if (!bounce) {
            this.position_ = this.position_
                .setX((x) => mod(x, width))
                .setY((y) => mod(y, height));
            return;
        }
        if (this.position_.x - this.radius_ < 0) {
            this.position_ = this.position_.setX((x) => this.radius_);
            this.velocity_ = this.velocity_.setX((x) => -x);
        } else if (this.position_.x + this.radius_ > width) {
            this.position_ = this.position_.setX((x) => width - this.radius_);
            this.velocity_ = this.velocity_.setX((x) => -x);
        }
        if (this.position_.y - this.radius_ < 0) {
            this.position_ = this.position_.setY((y) => this.radius_);
            this.velocity_ = this.velocity_.setY((y) => -y);
        } else if (this.position_.y + this.radius_ > height) {
            this.position_ = this.position_.setY((y) => height - this.radius_);
            this.velocity_ = this.velocity_.setY((y) => -y);
        }
    }

    

    public limitVelocity(maxMagnitude: number): void {
        this.velocity_ = this.velocity_.limit(maxMagnitude);
    }

    public render(
        canvas: HTMLCanvasElement,
        color: string = "black",
        modulus: boolean = false
    ): boolean {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log('Could get a "2d" context from ', canvas);
            return false;
        }

        const x = (modulus ? mod : (x: any, y: any) => x)(
            this.position_.x,
            canvas.width
        );
        const y = (modulus ? mod : (x: any, y: any) => x)(
            this.position_.y,
            canvas.height
        );

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius_, 0, 2 * Math.PI);
        ctx.fill();

        for (const orbiter of this.orbiters) {
            orbiter.render(canvas, color);
        }

        return true;
    }
}