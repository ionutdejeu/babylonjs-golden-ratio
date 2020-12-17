import { Engine, Scene, ArcRotateCamera, Vector3, CubeTexture, Color4 } from '@babylonjs/core'

export const numViewDirections:number= 300;
export const directions:Array<Vector3> = [];
export const computeDirections = ()=>{
    
    let goldenRatio:number = (1 + Math.sqrt(5)) / 2;
    let angleIncrement: number = Math.PI * 2 * goldenRatio;
    
    for (let i = 0; i < numViewDirections; i++) {
        let t = i / numViewDirections;
        let inclination = Math.acos (1 - 2 * t);
        let azimuth = angleIncrement * i;

        let x = Math.sin (inclination) * Math.cos (azimuth);
        let y = Math.sin (inclination) * Math.sin (azimuth);
        let z = Math.cos (inclination);
        directions[i] = new Vector3 (x, y, z);
    }
    return directions;
}