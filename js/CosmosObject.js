class CosmosObject {
    constructor(mass, [ x, y, z ], [ vx, vy, vz ], color, name) {
        this.mass = +mass;
        this.radius = this.radius ?? this.get_radius()
        
        this.x = x;
        this.y = y;
        this.z = z;

        this.vx = vx;
        this.vy = vy;
        this.vz = vz;

        this.color = color ?? this.randomColor();
        this.id = ++planetsAmount;
        this.name = name ?? 'Planet #' + this.id;

        let sphereGeo, sphereMat, sphereMesh;
        sphereGeo = new THREE.SphereBufferGeometry(this.radius,64,64);
        sphereMat = new THREE.MeshPhysicalMaterial( { color: this.color } )
        sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        this.mesh = sphereMesh;

        this.updateMesh()

        scene.add( this.mesh );
    }

    updateMesh() {
        // color changed
        let color = new THREE.Color(this.color);
        let hex = color.getHex();
        this.mesh.material.color.setHex(hex);
        // mass changed
        let scale = this.get_radius()/this.radius;
        this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = scale;
        // position changed
        this.mesh.position.x = this.x;
        this.mesh.position.y = this.y;
        this.mesh.position.z = this.z;
        // name changed
        this.mesh.name = this.name;
    }

    get_radius() {
        return 5 * Math.sqrt(Math.abs(this.mass) / Math.PI);
    }

    influence(b) {
        const a = this;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;

        const r = Math.hypot(dx, dy, dz);
        const acc = b.mass / r**2;

        const u = [ dx / r, dy / r, dz / r ];

        a.vx += u[0] * acc;
        a.vy += u[1] * acc;
        a.vz += u[2] * acc;
    }

    randomColor() {
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    draw() {
        this.mesh.position.x = this.x;
        this.mesh.position.y = this.y;
        this.mesh.position.z = this.z;
    }
}