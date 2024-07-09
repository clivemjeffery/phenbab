import {
    ArcRotateCamera,
    Color3,
    CubeTexture,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";

import { Inspector } from "@babylonjs/inspector";

import { NormalMaterial } from "@babylonjs/materials";

import {
        GrassProceduralTexture
} from "@babylonjs/procedural-textures";

export class AppOne {
    engine: Engine;
    scene: Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas)
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas)

    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            Inspector.Show(this.scene, {});
        } else {
            Inspector.Hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }



}


var createScene = function (engine: Engine, canvas: HTMLCanvasElement) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, -1.8, -10), scene);
    camera.setTarget(Vector3.Zero()); // This targets the camera to scene origin
    camera.attachControl(canvas, true);
    camera.upperBetaLimit = Math.PI / 2.2;

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Most examples dim light a small amount
    light.intensity = 0.8;

    const skybox = MeshBuilder.CreateBox("skyBox", {size:250}, scene);
    const skyboxMaterial = new StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Ground is the pitch, for now.
    // Web source: The majority of Premier League football pitches
    // measure 105.16m x 67.67m.
    let pitchMesh = MeshBuilder.CreateGround("pitch", 
        { 
            width: 68,
            height: 105 // actually depth since y is vertical 

        }, scene);
    let pitchMaterial = new StandardMaterial("pitchMat", scene);
    let grassTexture = new GrassProceduralTexture("grassTex", 4096, scene);
    pitchMaterial.ambientTexture = grassTexture;
    pitchMesh.material = pitchMaterial;

    // CJ beginnings of goal
    // The distance between the inside of the posts is 7.32m
    // and the distance from the lower edge of the crossbar to
    // the ground is 2.44 m
    const gpLeft = MeshBuilder.CreateCylinder("gpLeft", {
            height: 2.44, // need to offset by thickness
            diameter: 0.1,
        }, scene);
    gpLeft.position.y = 1.22;
    gpLeft.position.x = -7.32/2;

    const gpRight = MeshBuilder.CreateCylinder("gpRight", {
        height: 2.44, // need to offset by thickness
        diameter: 0.1,
    }, scene);
    gpRight.position.y = 1.22;
    gpRight.position.x = 7.32/2;

    const xBar = MeshBuilder.CreateCylinder("gpRight", {
        height: 7.32, // need to offset by thickness
        diameter: 0.1,
    }, scene);
    xBar.rotation = new Vector3(Math.PI/2, Math.PI/2, 0);
    xBar.position.y = 2.44;

    let gpostMaterial = new StandardMaterial("gpostMat", scene);
    gpostMaterial.diffuseColor = new Color3(1, 1, 1);
    
    xBar.material = gpostMaterial;
    gpRight.material = gpostMaterial;
    gpLeft.material = gpostMaterial;

    scene.registerBeforeRender(() => {
        
    });

    return scene;
};