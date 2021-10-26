import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { World } from '/scripts/world.js';

const AVERSION = 0.5
const CORRELATION = 0//0.01
const COHESION = 0.1


const findDirection = function(vector){
    const r = vector.length();
    const theta = Math.acos(vector.z/vector.length());
    const omega = Math.atan2(vector.y,vector.x);
    /*
    const X = new THREE.Vector3(0,1,0);
    const Y = new THREE.Vector3(0,0,1);
    //return new THREE.Euler(X.angleTo(vector),Y.angleTo(vector),0);
    return new THREE.Euler(X.angleTo(vector),0,Y.angleTo(vector));
    */
    return new THREE.Euler(-omega,omega,-theta);
}

class Agent {
  constructor(position = new THREE.Vector3(0,0,0), 
              orientation = new THREE.Vector3(0,0,0), 
	      velocity = new THREE.Vector3(0.5,0,0),
	      bodyShape = new THREE.ConeGeometry(),
	      skin = new THREE.MeshBasicMaterial({color:0xff00ff})
	     ){
    this.velocity = velocity;
    this.body = new THREE.Mesh(bodyShape, skin);
    this.world = new World();
    this.personalSpace = 4;
    this.sightRadius = 10;
    
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

  isClose(agent){
    const diff = this.position.clone(agent.position);
    return diff.length() <= (this.personalSpace + agent.personalSpace);
  }

  isVisible(agent){
    const diff = this.position.clone(agent.position);
    return diff.length() <= (this.sightRadius + agent.sightRadius);
  }

  step(){
    /////Check Boundaries/////
    const direction = this.world.outOfBounds(this.position);
    // Unclear if hamund product is implemented for Vector3d
    this.velocity = new THREE.Vector3( direction.x * this.velocity.x,
                                       direction.y * this.velocity.y,
                                       direction.z * this.velocity.z
                                     );

    ///Collision Avoidance/// TODO: Implement
    for (var agent of this.world.agents){
      if (this.isClose(agent)){
	//this.velocity.multiplyScalar(1 - AVERSION);
        //this.velocity.add(agent.velocity.clone().multiplyScalar(AVERSION));
	continue
      }
    }
    ///Velocity Matching///   TODO: Implement
    for (var agent of this.world.agents){
      if (this.isVisible(agent)){
	this.velocity.multiplyScalar(1 - CORRELATION);
        this.velocity.add(agent.velocity.clone().multiplyScalar(CORRELATION));
      }
    }
    ///Flock Centering///     TODO: Implement
    const center = this.world.agents.map((x,y) => x.position + y.position,0);


    this.position = this.position.add(this.velocity);
    //TODO: Change orientation properly
    this.orientation = findDirection(this.velocity);

  }

}

export { Agent };
