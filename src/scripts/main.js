import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
/*
* import { ItemToImport } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/...';
* ^ This is how we can snag other functionality from three.js
*/

import { World } from '/scripts/world.js';
import { Agent } from '/scripts/agent.js';

////////////////////Initialize Scene////////////////////
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight ); // Make entire window render the scene
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );


////////////////////Position camera////////////////////
const camera = new THREE.PerspectiveCamera( 45, 
				      window.innerWidth / window.innerHeight, 
				      1, 
				      500,
				    );
camera.position.set(0, 0, -30);
camera.lookAt(0, 0, 0);


////////////////////Light scene////////////////////
scene.add(new THREE.AmbientLight(0x666666, 100));

////////////////////Draw Agent////////////////////

var agent = new Agent(new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0) , new THREE.Vector3(1,0,0));
scene.add(agent.body);

/////////////////////Render scene////////////////////

const animate = function () {
 requestAnimationFrame( animate );
 agent.step();
 renderer.render( scene, camera );
};
animate();

