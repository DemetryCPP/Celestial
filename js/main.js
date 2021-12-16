'use strict';
// Scene
scene = new THREE.Scene();
scene.background = 0x000000;

let bodies = {};

function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.domElement.id = 'rendererCanvas';
    document.body.appendChild(renderer.domElement);
    renderer.domElement.addEventListener('mousemove', planetHover, false);

    // Camera
    camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,10000);
    camera.position.set(0,0,700);
    controls = new THREE.OrbitControls( camera, renderer.domElement );

    // Effect Composer
    copyPass = new THREE.ShaderPass( THREE.CopyShader );
    copyPass.renderToScreen = true;
    renderPass = new THREE.RenderPass( scene, camera );
    composer = new THREE.EffectComposer(renderer)
    outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#fefefe');
    outlinePass.edgeStrength = 8;
    outlinePass.edgeThickness = 1.0;
    outlinePass.pulsePeriod = 0;
    outlinePass.rotate = false;
    outlinePass.usePatternTexture = false;
    composer.setSize( window.innerWidth, window.innerHeight )
    composer.addPass( renderPass );
    composer.addPass( copyPass );
    composer.addPass( outlinePass );

    // Point Light
    pointlight = new THREE.PointLight(0xffffff,1);
    pointlight.position.set(200,200,200);
    scene.add(pointlight);

    const loader1 = new THREE.TextureLoader();
    loader1.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1c3aa651-ac56-4271-9b26-d43158957ff0/dcd7bft-805cd3ee-82db-45f4-8b3c-f76e7e8249c9.png/v1/fill/w_800,h_480,q_80,strp/star_field_texture_free_stock_by_jiajenn_dcd7bft-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDgwIiwicGF0aCI6IlwvZlwvMWMzYWE2NTEtYWM1Ni00MjcxLTliMjYtZDQzMTU4OTU3ZmYwXC9kY2Q3YmZ0LTgwNWNkM2VlLTgyZGItNDVmNC04YjNjLWY3NmU3ZTgyNDljOS5wbmciLCJ3aWR0aCI6Ijw9ODAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.JNCCbGQQFRxO1UMjSHiHeEPNYCe6PYkVZ7KPXznxzd0' , function(texture)
    {
        scene.background = texture;
    });

    // Adding some bodies
    createBody(1000, [ 0, 0, 0 ], [ 0, 0, 0 ])
    createBody(20, [ 200, 1, 100 ], [ 0, 0, Math.sqrt(1005/200) ])

    animate(); // rendering loop
}

// TODO: Check if body exists!
/**
 * Creates CosmosObject instance and adds it to the bodies array
 *
 * @param {number} mass       - Mass of the body
 * @param {array}  position   - XYZ position
 * @param {array}  velocities - XYZ velocity
 */
function createBody(mass, [ x, y, z ], [ vx, vy, vz ]) {
    let body = new CosmosObject(mass, [x, y, z], [vx, vy, vz]);
    bodies[body.name] = body;
}

function placeBodyToScene(body) {
    scene.add(body.mesh);
    controls.enabled = false;
    const trcontrols = new THREE.TransformControls(camera, renderer.domElement)
    trcontrols.attach(body.mesh)
    trcontrols.setMode('translate')
    scene.add(trcontrols);

    function handler(event) {
        if (event.code == 'Enter') {
            trcontrols.detach(body.mesh)
            scene.remove(trcontrols)
            controls.enabled = true;
            window.removeEventListener('keydown', handler, true);
            body.x = body.mesh.position.x;
            body.y = body.mesh.position.y;
            body.updateMesh();
            bodies[body.name] = body;
        }
    }

    window.addEventListener('keydown', handler);
}

/**
 * Deletes CosmosObject from the bodies array
 *
 * @param {number} bodyName - Name of the body
 * @todo make function to remove it by id
 */
function deleteBody(bodyName) {
    let selectedObject = scene.getObjectByName(bodyName);
    scene.remove( selectedObject );
    delete bodies[bodyName];
}

function planetHover(event) {
    event.preventDefault();
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObject(scene, true);

    let text = document.getElementById('planet-label')
    if (intersects.length > 0) {
        let object = intersects[0].object;
        selectedPlanet = object;
        outlinePass.selectedObjects = [selectedPlanet];

        text.innerHTML = object.name;
        text.style.display = "block";
        text.style.position = "absolute";
        text.style.left = event.clientX+10+'px';
        text.style.top = event.clientY+10+'px';
    } else {
        selectedPlanet = null;
        outlinePass.selectedObjects = [];
        text.style.display = "none";
    }

    renderer.render(scene, camera);
}

function animate() {

    for(let a of Object.keys(bodies)){
        for (let b of Object.keys(bodies)) {
            if (a !== b) {
                bodies[a].influence(bodies[b]);
            }
        }
        bodies[a].draw()

        bodies[a].x +=  bodies[a].vx;
        bodies[a].y +=  bodies[a].vy;
        bodies[a].z +=  bodies[a].vz;
    }
    renderer.render(scene, camera);
    composer.render();
    requestAnimationFrame(animate);
}

init();