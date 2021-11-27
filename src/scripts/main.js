import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
/*
* import { ItemToImport } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/...';
* ^ This is how we can snag other functionality from three.js
*/

import { World } from '/scripts/world.js';
import { Agent } from '/scripts/agent.js';

const world = new World()
const agent = new Agent();
const agent2 = new Agent(new THREE.Vector3(1,0,1), 
	                 new THREE.Vector3(0,1,0),
			 1,
                         new THREE.SphereGeometry(),
                         new THREE.MeshBasicMaterial({color:0x000fff})
                        );

const agent3 = new Agent(new THREE.Vector3(-3,-3,-3), 
	                 new THREE.Vector3(0,0,1),
			 1,
                         new THREE.SphereGeometry(),
                         new THREE.MeshBasicMaterial({color:0xffffff})
                         );


world.add(agent)
world.add(agent2)
world.add(agent3)
world.simulate()
