class Paddle {
    constructor(x) {
        this.w = 20;
        this.h = 130;
        this.pos = createVector(x , height / 2 - this.h / 2);
    }

    display() {
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    move(step) {
        this.pos.y += step;
    }

    checkEdges() {
        if (this.pos.y < 2) this.pos.y = 2;
        else if (this.pos.y > height - this.h - 1) this.pos.y = height - this.h - 1;
    }
}
