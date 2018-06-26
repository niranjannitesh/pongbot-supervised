class Ball {

    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.rx = 30;
        this.ry = 30;
        this.direction = {
            x: random(-2, 2),
            y: random(-2, 2)
        };
        this.velocity = createVector(1, 1).mult(16);
    }

    display() {
        ellipse(this.pos.x, this.pos.y, this.rx, this.ry);
    }

    update() {
        this.rx = 30;
        this.ry = 30;
        if (this.pos.y < height) {
            this.pos.x += this.velocity.x * this.direction.x / Math.abs(this.direction.x);
            this.pos.y += this.velocity.y * this.direction.y / Math.abs(this.direction.y);
        }
    }

    checkEdges() {
        if (this.pos.y < this.ry / 2 || this.pos.y > height - this.ry / 2) {
            this.ry -= 10;
            this.direction.y *= -1;
        }
    }

    collide(x, y, h) {
        if (this.pos.x < x && this.pos.x >= x - (this.rx / 2) && this.pos.y > y && this.pos.y < y + h + 20) {
            this.rx -= 10;
            ball.direction.x *= -1;
            return true;
        }
        return false;
    }
}
