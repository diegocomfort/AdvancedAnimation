import Vec2D from "./vec2d";

export default class Mover {
    private position_: Vec2D;
    private velocity_: Vec2D;
    private acceleration_: Vec2D;
    private radius_: number;

    public get position(): Vec2D {
        return this.position_;
    }

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
        return 2 * Math.PI * this.radius_;
    }

    constructor(options: {position?: Vec2D, velocity?: Vec2D, acceleration?: Vec2D, radius: number}) {
        this.position_ = options.position ?? new Vec2D;
        this.velocity_ = options.velocity ?? new Vec2D;
        this.acceleration_ = options.acceleration ?? new Vec2D;
        this.radius_ = options.radius;
    }

    public update(deltaTime: number, newAcceleration: Vec2D = new Vec2D): void {
        // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
        this.position_ = this.position_
            .add(this.velocity_.mult(deltaTime))
            .add(this.acceleration_.mult(deltaTime ** 2 * 0.5));
        this.velocity_ = this.velocity_
            .add(this.acceleration_.add(newAcceleration).mult(deltaTime * 0.5));
        this.acceleration_ = newAcceleration;
    }

    public checkWalls(width: number, height: number): void {
        if (this.position_.x - this.radius_ < 0) {
            this.position_ = this.position_.setX((x) => this.radius_);
            this.velocity_ = this.velocity_.setX((x) => -x);
        } else if (this.position_.x + this.radius_ > width) {
            this.position_ = this.position_.setX((x) => width - this.radius_);
            this.velocity_ = this.velocity_.setX((x) => -x);
            console.log(Date.now());
        }
        if (this.position_.y - this.radius_ < 0) {
            this.position_ = this.position_.setY((y) => this.radius_);
            this.velocity_ = this.velocity_.setY((y) => -y);
        } else if (this.position_.y + this.radius_ > height) {
            this.position_ = this.position_.setY((y) => height - this.radius_)
            this.velocity_ = this.velocity_.setY((y) => -y);
        }
    }

    public limitVelocity(maxMagnitude: number): void {
        this.velocity_ = this.velocity_.limit(maxMagnitude);
    }

    public render(canvas: HTMLCanvasElement, color: string = "black"): boolean {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("Could get a \"2d\" context from ", canvas);
            return false;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.position_.x, this.position_.y, this.radius_, 0, 2 * Math.PI);
        ctx.fill();
        return true;
    }
}