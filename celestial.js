const randomHex = () => (2 + Math.random() * 12 >> 0).toString(16);
const { hypot, sqrt, abs, PI } = Math;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let id = 0;
let k = 0.3;
let checkCollision = true;

class CosmosObject {
    constructor(mass, [ x, y ], [ vx, vy ]) {
        this.mass = mass;

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.color = `#` + Array.from(new Array(6), randomHex).join('');
        this.id = ++id;
    }

    get radius() {
        return 5 * sqrt(abs(this.mass) / PI);
    }

    influence(b = new CosmosObject) {
        const dx = this.x - b.x;
        const dy = this.y - b.y;

        const resistance = hypot(dx, dy);
        const b_acceleration = this.mass / resistance ** 2;

        b.vx += b_acceleration * dx / resistance;
        b.vy += b_acceleration * dy / resistance;
    }

    draw() {
        const circle = new Path2D();
        circle.moveTo(this.x, this.y)
        circle.arc(this.x, this.y, this.radius, 0, 2 * PI);
        ctx.fillStyle = this.color;
        ctx.fill(circle);
    }

    collision(b = new CosmosObject) {
        if (!b.check)
            return;

        const dx = this.x - b.x;
        const dy = this.y - b.y;
        
        if (dx ** 2 + dy ** 2 > (this.radius + b.radius) ** 2)
            return;

        b.x -= b.vx;
        b.y -= b.vy;

        this.x -= this.vx;
        this.y -= this.vy;

        const newvx1 = this.vx - (1 + k) * b.mass / (this.mass + b.mass) * (this.vx - b.vx);
        const newvy1 = this.vy - (1 + k) * b.mass / (this.mass + b.mass) * (this.vy - b.vy);
        
        const newvx2 = b.vx + (1 + k) * this.mass / (this.mass + b.mass) * (this.vx - b.vx);
        const newvy2 = b.vy + (1 + k) * this.mass / (this.mass + b.mass) * (this.vy - b.vy);
        
        this.vx = newvx1;
        this.vy = newvy1;

        b.vx = newvx2;
        b.vy = newvy2;
    }

    check = true;
}

const planets = [
    new CosmosObject(1000, [ 500, 500 ], [ 0, 0 ]),
    new CosmosObject(9, [ 500, 120 ], [ sqrt(1e3 / 400 ), 0 ]),
    new CosmosObject(2, [ 500, 85 ], [ sqrt(1e3 / 400 ) - sqrt(11/35), 0 ]),
]

setInterval(() => {
    for (let planet of planets)
        planet.check  = true;

    // gravity
    for (let a of planets)
        for (let b of planets)
            if (a.id != b.id)
                a.influence(b);
    
    // collision
    if (checkCollision) {
        for (let a of planets) {
            for (let b of planets)
                if (a.id != b.id)
                    a.collision(b)
            a.check = false;
        }
    }

    ctx.clearRect(0, 0, 1000, 1000);

    for (let planet of planets) {
        // create move
        planet.x += planet.vx;
        planet.y += planet.vy;

        // draw
        planet.draw();
    }
}, 1);