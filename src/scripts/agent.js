import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { World } from '/scripts/world.js';

const AVERSION = 0//0.4
const CORRELATION = 0//0.07
const COHESION = 0//0.03


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
	      speed = 0.3,
	      bodyShape = new THREE.ConeGeometry(),
	      skin = new THREE.MeshBasicMaterial({color:0xff00ff})
	     ){
    this.direction = direction.normalize();
    this.speed = speed;
    this.body = new THREE.Mesh(bodyShape, skin);
    this.world = new World();
    this.personalSpace = 4;
    this.sightRadius = 15;
    
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

  affect(vec, scalar){
    if (vec.length() != 0){
      vec.normalize().multiplyScalar(scalar);
      this.direction.multiplyScalar(1 - CORRELATION);
      this.direction.add(vec);
      this.direction.normalize();
    }
  }

  updateDirection(){
    /////Check Boundaries/////
    const boundary = this.world.outOfBounds(this);
    // Unclear if hamund product is implemented for Vector3d
    this.direction = new THREE.Vector3( boundary.x * this.direction.x,
                                        boundary.y * this.direction.y,
                                        boundary.z * this.direction.z
                                      );

    ///Collision Avoidance///
    var avoidingVec = new THREE.Vector3();
    for (var agent of this.world.agents){
      if (this.isClose(agent) && agent != this){
        avoidingVec.add(
	  new THREE.Vector3().subVectors(agent.position, this.position).multiplyScalar(-1)
	);
      }
    }
    this.affect(avoidingVec, AVERSION);

    ///Velocity Matching///
    var matchingVec = new THREE.Vector3();
    for (var agent of this.world.agents){
      if (this.isVisible(agent) && agent != this){
        matchingVec.add(this.direction);
      }
    }
    this.affect(matchingVec, CORRELATION);

    ///Flock Centering///
    var centeringVector = new THREE.Vector3();
    const include = (a,b) => this.isVisible(b) ? new THREE.Vector3((a.x + b.position.x)/2, 
                                                                   (a.y + b.position.y)/2, 
							           (a.z + b.position.z)/2) : a;
    const center = this.world.agents.reduce(include, new THREE.Vector3(0,0,0));
    centeringVector.subVectors(center, this.position);
    this.affect(centeringVector, COHESION);


  }

  step() {
    this.position = this.position.add(this.direction.clone().multiplyScalar(this.speed));
    //this.body.rotation.x = Math.acos(new THREE.Vector3(1,0,0).dot(this.direction));
    this.body.lookAt(this.direction.clone().add(this.position));
    this.body.rotation.x += Math.PI / 2
    this.body.rotation.y += 0
    this.body.rotation.z += 0
    console.log(Math.acos(new THREE.Vector3(1,0,0).dot(this.direction)),'x');
    console.log(Math.acos(new THREE.Vector3(0,1,0).dot(this.direction)),'y');
    console.log(Math.acos(new THREE.Vector3(0,0,1).dot(this.direction)),'z');
    //this.body.rotation.y = Math.acos(new THREE.Vector3(0,1,0).dot(this.direction));
    //this.body.rotation.z = Math.acos(new THREE.Vector3(0,0,1).dot(this.direction));
  }

}

export { Agent };
