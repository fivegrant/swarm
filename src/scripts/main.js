import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GUI } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module';

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
			 0.1,
                         new THREE.SphereGeometry(),
                         new THREE.MeshBasicMaterial({color:0x000fff})
                        );

const agent3 = new Agent(new THREE.Vector3(-3,-3,-3), 
	                 new THREE.Vector3(0,0,1),
			 0.6,
                         new THREE.SphereGeometry(),
                         new THREE.MeshBasicMaterial({color:0xffffff})
                         );

const agent4 = new Agent(new THREE.Vector3(9,9,9));
const agent5 = new Agent(new THREE.Vector3(-9,-9,-9));
const agent6 = new Agent(new THREE.Vector3(-9,9,-9));
const agent7 = new Agent(new THREE.Vector3(-9,9,9));
const agent8 = new Agent(new THREE.Vector3(-12,19,9));

world.add(agent)
world.add(agent2)
world.add(agent3)
world.add(agent4)
world.add(agent5)
world.add(agent6)
world.add(agent7)
world.add(agent8)

/// GUI ///
const gui = new GUI();

const make = (speed, hexColorCode) => {
  world.add(
    new Agent(new THREE.Vector3(1,0,1), 
	      new THREE.Vector3(0,1,0),
	      speed,
              new THREE.SphereGeometry(),
              new THREE.MeshBasicMaterial({color:hexColorCode})
              )
    );
};

const state = {
  color: '#ffffff', 
  speed: 0.3,
  add: () => make(state.speed, state.color),
  reset: () => world.reset()
};

const create = gui.addFolder('create agent');
create.add(state, 'color');
create.add(state, 'speed', 0.01 , 1);
create.add(state, 'add');

gui.add(state ,'reset');

world.simulate()
