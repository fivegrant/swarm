import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { World } from '/scripts/world.js';

class Agent {
  constructor(position = new THREE.Vector3(0,0,0), 
              orientation = new THREE.Vector3(0,0,0), 
	      velocity = new THREE.Vector3(1,0,0),
	      bodyShape = new THREE.ConeGeometry(),
	      skin = new THREE.MeshBasicMaterial({color:0xff00ff})
	     ){
    this.velocity = velocity;
    this.body = new THREE.Mesh(bodyShape, skin);
    
    //TODO: Clean up below
    this.body.rotation.x = orientation.x;
    this.body.rotation.y = orientation.y;
    this.body.rotation.z = orientation.z;

    this.body.position.x = position.x;
    this.body.position.y = position.y;
    this.body.position.z = position.z;
  }

  get position(){
    return this.body.position;
  }

  get orientation(){
    return this.body.rotation;
  }

  //TODO: Clean up setters
  set position(value){
    this.body.position.x = value.x;
    this.body.position.y = value.y;
    this.body.position.z = value.z;
  }

  set orientation(value){
    this.body.rotation.x = value.x;
    this.body.rotation.y = value.y;
    this.body.rotation.z = value.z;

  }

  step(){
    this.updateVelocity();
    this.position = this.position.add(this.velocity);
    //TODO: Change orientation
  }

  updateVelocity(){
    const world = new World(); // TODO: Find a better place for this object
    const direction = world.outOfBounds(this.position);
    // Unclear if hamund product is implemented for Vector3d
    this.velocity= new THREE.Vector3(  direction.x * this.velocity.x,
                                       direction.y * this.velocity.y,
                                       direction.z * this.velocity.z
                                    )
 };
}

export {Agent};
