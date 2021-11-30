import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { World } from '/scripts/world.js';

const defaultParameters = {
  aversion: 0.25,
  correlation: 0.1,
  cohesion: 0.08,
  personalSpace: 4,
  sightRadius: 15,
}

class Agent {
  constructor(parameters = defaultParameters,
              position = new THREE.Vector3(0,0,0), 
	      direction = new THREE.Vector3(1,0,0),
	      speed = 0.3,
	      bodyShape = new THREE.ConeGeometry(),
	      skin = new THREE.MeshBasicMaterial({color:0xff00ff})
	     ){
    this.parameters = parameters;
    this.direction = direction.normalize();
    this.speed = speed;
    this.body = new THREE.Mesh(bodyShape, skin);
    this.body.geometry.rotateX(Math.PI / 2); // Align cone so it works with `lookAt`
    this.world = new World();
    
    this.body.position.x = position.x;
    this.body.position.y = position.y;
    this.body.position.z = position.z;
  }

  get position(){
    return this.body.position;
  }

  set position(value){
    this.body.position.x = value.x;
    this.body.position.y = value.y;
    this.body.position.z = value.z;
  }

  isClose(agent){
    const diff = this.position.clone(agent.position);
    return diff.length() <= (this.parameters.personalSpace + agent.parameters.personalSpace);
  }

  isVisible(agent){
    const diff = this.position.clone(agent.position);
    return diff.length() <= (this.parameters.sightRadius + agent.parameters.sightRadius);
  }

  affect(vec, scalar){
    if (vec.length() != 0){
      vec.normalize().multiplyScalar(scalar);
      this.direction.multiplyScalar(1 - scalar);
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
    this.affect(avoidingVec, this.parameters.aversion);

    ///Velocity Matching///
    var matchingVec = new THREE.Vector3();
    for (var agent of this.world.agents){
      if (this.isVisible(agent) && agent != this){
        matchingVec.add(this.direction);
      }
    }
    this.affect(matchingVec, this.parameters.correlation);

    ///Flock Centering///
    var centeringVector = new THREE.Vector3();
    const include = (a,b) => this.isVisible(b) ? new THREE.Vector3((a.x + b.position.x)/2, 
                                                                   (a.y + b.position.y)/2, 
							           (a.z + b.position.z)/2) : a;
    const center = this.world.agents.reduce(include, new THREE.Vector3(0,0,0));
    centeringVector.subVectors(center, this.position);
    this.affect(centeringVector, this.parameters.cohesion);


  }

  step() {
    this.position = this.position.add(this.direction.clone().multiplyScalar(this.speed));
    this.body.lookAt(this.direction.clone().multiplyScalar(2).add(this.position));
  }

}

export { Agent };


/*
   Slight help on cone direction. I was having the cone use `lookAt`, but I couldn't
   get the tip to line up. I tried all sorts of rotation trickery. This solution I 
   finally came across: 
     https://discourse.threejs.org/t/how-to-make-a-cone-turn-to-point-in-x-x-y-etc-directions/28096
   said to rotate the mesh `geometry` along x by pi/2. This solved the problem so the arrow pointed
   the direction it was heading in instead of up.
*/
