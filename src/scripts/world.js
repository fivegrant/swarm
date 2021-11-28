import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

class World {
  constructor(
              from = new THREE.Vector3(-50,-50,-50), 
              to = new THREE.Vector3(50,50,50) //assuming components are all greater than from
             ){                                //TODO: Enforce the above

    if(!World.singleton){
      this.boundaries = [from, to]
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer();
      this.camera = new THREE.PerspectiveCamera(
                                                 45, 
				                 window.innerWidth / window.innerHeight, 
				                 1, 
				                 500,
				               );
      this.agents = [];


      /////Set up Graphical Scene/////
      this.renderer.setSize( window.innerWidth, window.innerHeight ); // Make entire window render the scene
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      document.body.appendChild(this.renderer.domElement);
      this.scene.add(new THREE.AmbientLight(0x666666, 100));

      /////Set up Camera/////
      this.camera.position.set(25, 5, 30);
      this.camera.lookAt(0, 0, 0);
      const controls = new OrbitControls(this.camera, this.renderer.domElement);


      /////Ensure Singleton/////
      World.singleton = this;
    }

    return World.singleton;
  };  

  add(agent){
    const i = this.agents.push(agent) - 1;
    this.scene.add(this.agents[i].body);
  };


  //Returns coefficients that flip the component if it's out of bounds
  //TODO: Make this cleaner
  outOfBounds(position){
    const xValid = this.boundaries[0].x < position.x && position.x < this.boundaries[1].x ? 1 : -1;
    const yValid = this.boundaries[0].y < position.y && position.y < this.boundaries[1].x ? 1 : -1;
    const zValid = this.boundaries[0].z < position.z && position.z < this.boundaries[1].x ? 1 : -1;

    return new THREE.Vector3(xValid,yValid,zValid);
  };

  simulate() {
    requestAnimationFrame( this.simulate.bind(this) );
    this.agents.map(x => x.updateDirection());
    this.agents.map(x => x.step());
    this.renderer.render( this.scene, this.camera );
  };

}

export { World };

/*
   Slight help on JS class details around singletons
   Didn't use the freezing idea, just the saving data to the class
   basically, the only pattern i used from it was:
     ...
     if (! Object.instance){
       ...~construct stuff~...
       Object.instance = this
     }
     return Object.instance
     ...

   which is a stripped down version of what the author was proposing.
   (I want to make sure it's easier to modify)
   https://www.sitepoint.com/javascript-design-patterns-singleton/
*/

