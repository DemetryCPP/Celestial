const objects = [
    new CosmosObject(1000, [ 0, 0 ], [ 0, 0 ]),
    new CosmosObject(5, [ 0, 200 ], [ sqrt(1005/200), 0 ])
]

function step() {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

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