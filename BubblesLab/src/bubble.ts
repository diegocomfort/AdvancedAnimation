import Vec2D from "./vec2d.js";

export default class Bubble {
    private radius_: number;
    private pos_: Vec2D;
    private vel_: Vec2D;
    private acc_: Vec2D;
    private overlapping_: boolean = false;
    private defaultColor_: string;
    private overlapColor_: string;

    constructor(radius: number,
        pos: Vec2D = new Vec2D,
        vel: Vec2D = new Vec2D,
        acc: Vec2D = new Vec2D,
        defaultColor: string = "white",
        overlapColor: string = "pink") {
        this.radius_ = radius;
        this.pos_ = pos;
        this.vel_ = vel;
        this.acc_ = acc;
        this.defaultColor_ = defaultColor;
        this.overlapColor_ = overlapColor;
    }

    public Builder = class Builder {
        private radius: number;
        private pos: Vec2D;
        private vel: Vec2D;
        private acc: Vec2D;
        private defaultClr: string;
        private overlapClr: string;

        constructor(radius: number) {
            this.radius = radius;
            this.pos = new Vec2D();
            this.vel = new Vec2D();
            this.acc = new Vec2D();
            this.defaultClr = "black";
            this.overlapClr = "white";
        }

        build(): Bubble {
            return new Bubble(
                this.radius,
                this.pos,
                this.vel,
                this.acc,
                this.defaultClr,
                this.overlapClr,
            );
        }

        position(pos: Vec2D): Builder {
            this.pos = pos;
            return this;
        }

        velocity(vel: Vec2D): Builder {
            this.vel = vel;
            return this;
        }

        acceleration(acc: Vec2D): Builder {
            this.acc = acc;
            return this;
        }

        defaultColor(clr: string): Builder {
            this.defaultClr = clr;
            return this;
        }

        overlapColor(clr: string): Builder {
            this.overlapClr = clr;
            return this;
        }
    };

    public get radius(): number {
        return this.radius_;
    }

    public get pos(): Vec2D {
        return this.pos_;
    }

    public get vel(): Vec2D {
        return this.vel_;
    }

    public get acc(): Vec2D {
        return this.acc_;
    }

    public get overlapping(): boolean {
        return this.overlapping_;
    }

    public get defaultColor(): string {
        return this.defaultColor_;
    }

    public get overlapColor(): string {
        return this.overlapColor_;
    }

    applyForces(attractors: Array<Bubble>, repulsers: Array<Bubble>): Vec2D {
        let acc = new Vec2D();
        const scale = 0.5;

        for (const attractor of attractors) {
            let tmp = attractor.pos
                .sub(this.pos)
                .normalize()
                .mult(scale);
            acc = acc.add(tmp);
        }

        for (const repulser of repulsers) {
            let tmp = this.pos
                .sub(repulser.pos)
                .normalize()
                .mult(scale);
            acc = acc.add(tmp);
        }

        return acc;
    }

    update(deltaTime: number, newAccelaration: Vec2D = new Vec2D): void {
        // Verlet integration: https://en.wikipedia.org/wiki/Verlet_integration
        this.pos_ = this.pos_
            .add(this.vel_.mult(deltaTime))
            .add(this.acc_.mult(deltaTime ** 2 * 0.5));
        this.vel_ = this.vel_
            .add(this.acc_.add(newAccelaration).mult(deltaTime * 0.5));
        this.acc_ = newAccelaration;
    }

    checkWalls(width: number, height: number): void {
        if (this.pos_.x - this.radius_ < 0) {
            this.pos_ = this.pos_.setX((x) => this.radius_);
            this.vel_ = this.vel_.setX((x) => -x);
        } else if (this.pos_.x + this.radius_ > width) {
            this.pos_ = this.pos_.setX((x) => width - this.radius_);
            this.vel_ = this.vel_.setX((x) => -x);
            console.log(Date.now());
        }
        if (this.pos_.y - this.radius_ < 0) {
            this.pos_ = this.pos_.setY((y) => this.radius_);
            this.vel_ = this.vel_.setY((y) => -y);
        } else if (this.pos_.y + this.radius_ > height) {
            this.pos_ = this.pos_.setY((y) => height - this.radius_)
            this.vel_ = this.vel_.setY((y) => -y);
        }
    }

    checkOverlap(otherBubbles: Array<Bubble>): void {
        if (this.overlapping_) return;
        for (const b of otherBubbles) {
            if (b === this) continue;
            if (this.pos_.dist(b.pos_) <= this.radius_ + b.radius_) {
                this.overlapping_ = b.overlapping_ = true;
            }
        }
    }

    render(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.log("Could not retrieve a \'2d\' context from ", canvas);
            return;
        }
        ctx.fillStyle = this.overlapping_ ? this.overlapColor_ : this.defaultColor_;
        ctx.beginPath();
        ctx.arc(this.pos_.x, this.pos_.y, this.radius_, 0, Math.PI * 2, true);
        ctx.fill();
    }

    resetOverlapping(): void {
        this.overlapping_ = false;
    }
}