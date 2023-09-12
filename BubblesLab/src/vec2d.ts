type radian = number;

export default class Vec2D {
    readonly x: number;
    readonly y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static I = new Vec2D(1, 0);
    static J = new Vec2D(0, 1);

    static from(vector: Vec2D): Vec2D {
        return new Vec2D(vector.x, vector.y);
    }

    static fromAngle(theta: radian, magnitude: number = 1): Vec2D {
        return new Vec2D(magnitude * Math.cos(theta), magnitude * Math.sin(theta));
    }

    copy(): Vec2D {
        return new Vec2D(this.x, this.y);
    }

    setX(xMutator: (x: number) => number): Vec2D {
        return new Vec2D(xMutator(this.x), this.y);
    }

    setY(yMutator: (y: number) => number): Vec2D {
        return new Vec2D(this.x, yMutator(this.y));
    }

    add(vector: Vec2D): Vec2D {
        return new Vec2D(this.x + vector.x, this.y + vector.y);
    }

    sub(vector: Vec2D): Vec2D {
        return new Vec2D(this.x - vector.x, this.y - vector.y);
    }

    mult(scalar: number): Vec2D {
        return new Vec2D(this.x * scalar, this.y * scalar);
    }

    mag(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    magSq(): number {
        return this.x ** 2 + this.y ** 2;
    }

    setMagnitude(newMag: number): Vec2D {
        return this.mult(newMag / this.mag());
    }

    normalize(): Vec2D {
        return this.setMagnitude(1);
    }
    
    limit(maxMag: number): Vec2D {
        return this.mag() > maxMag ? this.setMagnitude(1): this;
    }

    div(scalar: number): Vec2D {
        return new Vec2D(this.x / scalar, this.y / scalar);
    }

    angle(): number {
        return Math.atan2(this.y, this.x);
    }
    
    setAngle(theta: radian): Vec2D {
        const mag = this.mag();
        return new Vec2D(Math.cos(theta) * mag, Math.sin(theta) * mag);
    }

    rotate(theta: radian): Vec2D {
        const angle = this.angle();
        const mag = this.mag();
        return new Vec2D(Math.cos(angle + theta) * mag, Math.sin(angle + theta) * mag);
    }

    angleBetween(vector: Vec2D): number {
        return this.angle() - vector.angle();
    }

    dist(vector: Vec2D): number {
        return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) **2);
    }

    distSQ(vector: Vec2D): number {
        return (this.x - vector.x) ** 2 + (this.y - vector.y) **2;
    }
};

