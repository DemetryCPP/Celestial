class CosmosObject {
    constructor(mass, [ x, y ], [ vx, vy ], color) {
        this.mass = +mass;
        
        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.color = color ?? this.randomColor();
    }

    get radius() {
        return 5 * sqrt(abs(this.mass) / PI);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    influence(b = new CosmosObject) {
        const a = this;

        const dx = b.x - a.x;
        const dy = b.y - a.y;

        const r = hypot(dx, dy);
        const acc = b.mass / r**2;

        const u = [ dx / r, dy / r ];

        a.vx += u[0] * acc;
        a.vy += u[1] * acc;
    }

    randomColor() {
        const randomHEX = () => (8 + round(random() * 8)).toString(16);
        return '#' + Array.from(new Array(6), randomHEX).join('');
    }
}