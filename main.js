import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
/*
* import { ItemToImport } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/...';
* ^ This is how we can snag other functionality from three.js
*/

////////////////////Initialize Scene////////////////////
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Make entire window render the scene
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

////////////////////Position camera////////////////////
const camera = new THREE.PerspectiveCamera( 45, 
				            window.innerWidth / window.innerHeight, 
				            1, 
				            500,
				          );
camera.position.set(0, 10, 10);
camera.lookAt(0, 0, 0);

////////////////////Light scene////////////////////
scene.add(new THREE.AmbientLight(0x666666, 100));

////////////////////Draw Agent////////////////////
const geometry = new THREE.ConeGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
const agent = new THREE.Mesh(geometry, material);
agent.rotation.x = 1
scene.add(agent);

const calcVelocity = function(agent) {
  if (agent.position.x < -10){
    agent.rotation.x = 1;
  } else if (agent.position.x > 10) {
    agent.rotation.x = -1;
  }
  if (agent.rotation.x == 1) {
    agent.position.x += 0.1;
  } else if (agent.rotation.x == -1) {
    agent.position.x -= 0.1;
  }
};

////////////////////Render scene////////////////////
const animate = function () {
  requestAnimationFrame( animate );
  calcVelocity(agent)
  renderer.render( scene, camera );
};

animate();

