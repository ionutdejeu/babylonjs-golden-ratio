import { Vector3,Mesh, AnaglyphUniversalCamera, Space, Axis, Ray, Scene, LinesBuilder, LinesMesh} from "@babylonjs/core";
import { directions } from "./boydHelper";

class BoidData{
    position:Vector3 | undefined;
    direction:Vector3 | undefined;
    flockHeading: Vector3 | undefined;
    flockCentre: Vector3 | undefined;
    separationHeading: Vector3 | undefined;
    numFlockmates:number | undefined;
}


export const boydSettings = {
    minSpeed:2,
    maxSpeed:5,
    perceptionRadius:2.5,
    avoidanceRadius:1,
    maxSteerForce:3,
    alignWeight:1,
    cohesionWeight:1,
    seperateWeight:1,
    targetWeight:1,
    obstacleMask: 0x000001,
    boundsRadius:0.27,
    avoidCollisionWeight:10,
    collisionAvoidDistance:50
}


export const vecToLocal = (vec:Vector3,mesh:Mesh)=>{
    return Vector3.TransformCoordinates(vec, mesh.getWorldMatrix());
}

export const moveForwards = (mesh:Mesh,delta:number,speed:number)=>{
    mesh.translate(Axis.X,speed*delta,Space.WORLD);
} 

export const IsHeadingForCollision= (m:Mesh,scene:Scene,targetMesh:Mesh|undefined)=>{
    const rDir = vecToLocal(Axis.X,m);
    const r = new Ray(m.position,rDir,boydSettings.collisionAvoidDistance);
    let hit = scene.pickWithRay(r);
    if (hit?.pickedMesh){
        if(targetMesh!==undefined && hit.pickedPoint){
            console.log(hit.pickedMesh);
            targetMesh.position = m.position.add(rDir);
        }
        return true;
    }
    return false;
}
 
const ObstacleRays = (m:Mesh, scene:Scene)=>{
    for(let i = 0; i < directions.length; i++) {
        const dir = vecToLocal(directions[i],m);
        const r = new Ray(m.position,vecToLocal(Axis.X,m),boydSettings.collisionAvoidDistance);
        
    }
}

class Boid {
    settings:Object|undefined;
    target:Mesh|undefined;
    initialize(settings:any,target:Mesh){
        this.settings = settings;
        this.target = target;
    }
}

const compute = (boids:Array<BoidData>,nrBoids:number,viewRadius:number,avoidRadius:number)=>{

    for (let indexB = 0; indexB < boids.length; indexB++) {
        const boidB = boids[indexB];
        //let offset = boidB.position?.subtract()
    }
}