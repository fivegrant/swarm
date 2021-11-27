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
	      direction = new THREE.Vector3(1,0,0),
	      speed = 1,
	      bodyShape = new THREE.SphereGeometry(),
	      skin = new THREE.MeshBasicMaterial({color:0xff00ff})
	     ){
    this.direction = direction.normalize();
    this.speed = speed;
    this.body = new THREE.Mesh(bodyShape, skin);
    this.world = new World();
    this.personalSpace = 4;
    this.sightRadius = 10;
    
    //TODO: Clean up below
    this.body.position.x = position.x;
    this.body.position.y = position.y;
    this.body.position.z = position.z;
  }

  get position(){
    return this.body.position;
  }

  //TODO: Clean up setters
  set position(value){
    this.body.position.x = value.x;
    this.body.position.y = value.y;
    this.body.position.z = value.z;
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
    console.log(this.direction.length(),"before");
    /////Check Boundaries/////
    const boundary = this.world.outOfBounds(this.position);
    // Unclear if hamund product is implemented for Vector3d
    this.direction = new THREE.Vector3( boundary.x * this.direction.x,
                                        boundary.y * this.direction.y,
                                        boundary.z * this.direction.z
                                      );

    ///Collision Avoidance///
    for (var agent of this.world.agents){
      if (this.isClose(agent)){
	//this.velocity.multiplyScalar(1 - AVERSION);
        //this.velocity.add(agent.velocity.clone().multiplyScalar(AVERSION));
	continue
      }
    }
    ///Velocity Matching///
    for (var agent of this.world.agents){
      if (this.isVisible(agent)){
	this.direction.multiplyScalar(1 - CORRELATION);
        this.direction.add(agent.direction.clone().multiplyScalar(CORRELATION));
      }
    }
    ///Flock Centering///
    const center = this.world.agents.map((x,y) => x.position + y.position,0);

    console.log(this.direction.length(),"after");
    this.position = this.position.add(this.direction).multiplyScalar(this.speed);
  }

}

export { Agent };
