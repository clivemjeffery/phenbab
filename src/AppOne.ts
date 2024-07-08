import * as BABYLON from 'babylonjs'
export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas)
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas)

    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }



}


var createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0), scene);


    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    // Move the sphere upward 1/2 its height
    //let startPos = 2;
    //sphere.position.y = startPos;

    // CJ beginnings of goal
    // The distance between the inside of the posts is 7.32m
    // and the distance from the lower edge of the crossbar to
    // the ground is 2.44 m
    const gpLeft = BABYLON.MeshBuilder.CreateCylinder("gpLeft", {
            height: 2.44, // need to offset by thickness
            diameter: 0.1,
        }, scene);
    gpLeft.position.y = 1.22;
    gpLeft.position.x = -7.32/2;

    const gpRight = BABYLON.MeshBuilder.CreateCylinder("gpRight", {
        height: 2.44, // need to offset by thickness
        diameter: 0.1,
    }, scene);
    gpRight.position.y = 1.22;
    gpRight.position.x = 7.32/2;

    const xBar = BABYLON.MeshBuilder.CreateCylinder("gpRight", {
        height: 7.32, // need to offset by thickness
        diameter: 0.1,
    }, scene);
    xBar.rotation = new BABYLON.Vector3(Math.PI/2, Math.PI/2, 0);
    xBar.position.y = 2.44;

    // Our built-in 'ground' shape.
    // Refashion to be football pitch-like
    // Web source: The majority of Premier League football pitches
    // measure 105.16m x 67.67m.
    var ground = BABYLON.MeshBuilder.CreateGround("pitch", 
        { 
            width: 68,
            height: 105 // actually depth since y is vertical 

        }, scene);
    var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    
    groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.8, 0.5); // RGB for a greenish color
    ground.material = groundMaterial;
    groundMaterial.bumpTexture = new BABYLON.Texture("./normal.jpg", scene);


    scene.registerBeforeRender(() => {
        
    });

    return scene;
};