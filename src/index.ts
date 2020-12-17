import 'pepjs'

import { HemisphericLight, 
  Vector3, 
  MeshBuilder, 
  PBRMetallicRoughnessMaterial, 
  Color3, 
  SceneLoader,
  ActionManager,
  ExecuteCodeAction,
  VertexBuffer,
  StandardMaterial,
  PerformanceMonitor,
BoxBuilder,
InstancedMesh,
Scene,
Mesh,
Axis} from '@babylonjs/core'
import { createEngine, createScene, createPBRSkybox, createArcRotateCamera } from './babylon'
import {computeDirections,directions} from './boydHelper';
import {moveForwards,boydSettings,IsHeadingForCollision} from './boyd';
// Import stylesheets
// import './index.css';

const canvas: HTMLCanvasElement = document.getElementById('root') as HTMLCanvasElement
const engine = createEngine(canvas)
const scene = createScene()
const boids:Mesh[] = []
let targetMesh:Mesh;
//const DebugLineHeadingCollisionCheck:LinesMesh;

// main function that is async so we can call the scene manager with await
const main = async () => {

  createPBRSkybox()
  createArcRotateCamera()

  scene.registerBeforeRender(function () {
    updateBoids();
    
  });
  const light = new HemisphericLight('light', Vector3.Zero(), scene)
  light.intensity = 0.3

  let mat = new StandardMaterial("walls_transparent_material",scene);
  mat.emissiveColor = Color3.White();
  mat.alpha = 0.1;

  targetMesh = BoxBuilder.CreateBox('target_mesh', { size: 1 }, scene)
  targetMesh.isPickable = false;
  
  const ground = Mesh.CreateGround("ground1", 60, 60, 2, scene);
  ground.position.y = -.1;
  ground.showBoundingBox = true;
  ground.material = mat;
  
  const wallR = Mesh.CreatePlane("wall_right",60,scene);
  wallR.position = new Vector3(0,30,30);
  wallR.showBoundingBox = true;
  wallR.material = mat;
  

  const wallL = Mesh.CreatePlane("wall_left",60,scene);
  wallL.position = new Vector3(0,30,-30);
  wallL.showBoundingBox = true;
  wallL.material= mat;

  const wallB = Mesh.CreatePlane("wall_back",60,scene);
  wallB.position = new Vector3(30,30,0);
  wallB.rotate(Axis.Y,Math.PI/2);
  wallB.showBoundingBox = true;
  wallB.material = mat;

  const wallTop = Mesh.CreatePlane("wall_top",60,scene);
  wallTop.position = new Vector3(0,60,0);
  wallTop.rotate(Axis.X,Math.PI/2);
  wallTop.showBoundingBox = true;
  wallTop.material = mat;

  const wallFront = Mesh.CreatePlane("wall_front",60,scene);
  wallFront.position = new Vector3(0,60,0);
  wallFront.rotate(Axis.X,Math.PI/2);
  wallFront.showBoundingBox = true;
  wallFront.material = mat;

  //randomCubesOf(scene);
  //pointsOnAShpere(scene);
  createBoids(scene);

  // Start the scene
  engine.runRenderLoop(() => {
    scene.render()
  })
}

const updateBoids = ()=>{
  let deltaTime = engine.getDeltaTime();
  for (let i = 0; i < boids.length; i++) {
    const b = boids[i];
    if(!IsHeadingForCollision(b,scene,targetMesh)){
      moveForwards(b,deltaTime,0.01);
    }
  }
}

const createBoids = (scene:Scene)=>{
  const box = BoxBuilder.CreateBox('boid_template', { size: 2 }, scene)
  let instanceCount = 1;
  let colorData = new Float32Array(4 * instanceCount);

  for (var index = 0; index < instanceCount; index++) {
      colorData[index * 4] = Math.random();
      colorData[index * 4 + 1] = Math.random();
      colorData[index * 4 + 2] = Math.random();
      colorData[index * 4 + 3] = 1.0;
  }

  var buffer = new VertexBuffer(engine, colorData, VertexBuffer.ColorKind, false, false, 4, true);
  box.setVerticesBuffer(buffer);
  box.isPickable = false;

  //DebugLineHeadingCollisionCheck =  LinesBuilder.CreateLines("ForwadCollisionChck",{points:[box.position,
  //  m.position.add(rDir.scale(boydSettings.collisionAvoidDistance))]},scene);
  let mat = new StandardMaterial("material",scene);
  mat.emissiveColor = Color3.White();

  var localOrigin = localAxes(2);
  localOrigin.parent = box;
  box.position = new Vector3(2, 3, 4);

  boids.push(box);
}

//Local Axes
function localAxes(size:number) {
  var pilot_local_axisX = Mesh.CreateLines("pilot_local_axisX", 
  [
    Vector3.Zero(), 
    new Vector3(size, 0, 0), 
    new Vector3(size * 0.95, 0.05 * size, 0), 
    new Vector3(size, 0, 0), 
    new Vector3(size * 0.95, -0.05 * size, 0)
  ], scene);
  pilot_local_axisX.color = new Color3(1, 0, 0);

  var pilot_local_axisY = Mesh.CreateLines("pilot_local_axisY", 
    [
      Vector3.Zero(), 
      new Vector3(0, size, 0),
      new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0), 
      new Vector3(0.05 * size, size * 0.95, 0)
  ], scene);
  pilot_local_axisY.color = new Color3(0, 1, 0);

  var pilot_local_axisZ = Mesh.CreateLines("pilot_local_axisZ", [
      Vector3.Zero(), 
      new Vector3(0, 0, size), 
      new Vector3( 0 , -0.05 * size, size * 0.95),
      new Vector3(0, 0, size),
      new Vector3( 0, 0.05 * size, size * 0.95)
      ], scene);
  pilot_local_axisZ.color = new Color3(0, 0, 1);

  var local_origin = MeshBuilder.CreateBox("local_origin", {size:1}, scene);
  local_origin.isVisible = false;

  pilot_local_axisX.parent = local_origin;
  pilot_local_axisY.parent = local_origin;
  pilot_local_axisZ.parent = local_origin; 

  return local_origin;
}

const randomCubesOf= (scene:Scene)=>{

  //add cube
  const box = BoxBuilder.CreateBox('cube', { size: 2 }, scene)
  let instanceCount = 1000;
  let colorData = new Float32Array(4 * instanceCount);

  for (var index = 0; index < instanceCount; index++) {
      colorData[index * 4] = Math.random();
      colorData[index * 4 + 1] = Math.random();
      colorData[index * 4 + 2] = Math.random();
      colorData[index * 4 + 3] = 1.0;
  }

  var buffer = new VertexBuffer(engine, colorData, VertexBuffer.ColorKind, false, false, 4, true);
  box.setVerticesBuffer(buffer);

  let mat = new StandardMaterial("material",scene);
  mat.emissiveColor = Color3.White();

  box.material = mat;
  for (var index = 0; index < instanceCount - 1; index++) {
    let instance = box.createInstance("box" + index);
    instance.position.x = 20 - Math.random() * 40;
    instance.position.y = 20 - Math.random() * 40;
    instance.position.z = 20 - Math.random() * 40;
    instance.alwaysSelectAsActiveMesh = true;
    instance.freezeWorldMatrix();
    instance.actionManager = new ActionManager(scene);
    instance.actionManager.registerAction(
      new ExecuteCodeAction(
          ActionManager.OnPickTrigger, function(bjsevt) {
              console.log(bjsevt);
          }
      )
    )
  }
}

const pointsOnAShpere = (scene:Scene) => {

  let directions = computeDirections();
  const box = BoxBuilder.CreateBox('cube', { size: 2 }, scene)
 

  let colorData = new Float32Array(4 * directions.length);

  for (var index = 0; index < directions.length; index++) {
        colorData[index * 4] = Math.random();
        colorData[index * 4 + 1] = Math.random();
        colorData[index * 4 + 2] = Math.random();
        colorData[index * 4 + 3] = 1.0;
    }

  var buffer = new VertexBuffer(engine, colorData, VertexBuffer.ColorKind, false, false, 4, true);
  box.setVerticesBuffer(buffer);

  let mat = new StandardMaterial("material",scene);
  mat.emissiveColor = Color3.White();
  box.material = mat;


  for(let dir=0;dir<directions.length;dir++){
    let instance = box.createInstance("box" + dir);
    instance.position = directions[dir].scale(40);
    instance.alwaysSelectAsActiveMesh = true;
    instance.freezeWorldMatrix();
    instance.actionManager = new ActionManager(scene);
    instance.actionManager.registerAction(
      new ExecuteCodeAction(
          ActionManager.OnPickTrigger, function(bjsevt) {
              console.log(bjsevt);
          }
      )
    )
  }
}

// start the program
main()
