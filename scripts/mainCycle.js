const objects = [
    new CosmosObject(1000, [ 375, 375 ], [ -0.01, 0 ]),
    new CosmosObject(4, [ 375, 100 ], [ sqrt(1e3 / 275 ), 0 ]),
    new CosmosObject(1, [ 375, 85 ], [ sqrt(1e3 / 275 ) - sqrt(5/15), 0 ]),
    new CosmosObject(6, [ 70, 375 ], [ 0, sqrt(1e3 / 285) ])
]

function step() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    for (let a of objects) {
        for (let b of objects)
            if (a != b)
                a.influence(b);
        
        a.draw();

        a.x += a.vx;
        a.y += a.vy;
    }
}

setInterval(step, 20);