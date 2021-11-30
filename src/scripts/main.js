import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GUI } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module';

/*
* import { ItemToImport } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/...';
* ^ This is how we can snag other functionality from three.js
*/

import { World } from '/scripts/world.js';
import { Agent } from '/scripts/agent.js';

const parameters = {
  aversion: 0.25,
  correlation: 0.1,
  cohesion: 0.08,
  personalSpace: 4,
  sightRadius: 15,
}

const world = new World()
const agent = new Agent(parameters);
const agent2 = new Agent(parameters,
                         new THREE.Vector3(1,0,1), 
	                 new THREE.Vector3(0,1,0),
			 0.7,//0.1,
                         new THREE.ConeGeometry(),
                         new THREE.MeshBasicMaterial({color:0x000fff})
                        );

const agent3 = new Agent(parameters,
                         new THREE.Vector3(-3,-3,-3), 
	                 new THREE.Vector3(0,0,1),
			 0.6,
                         new THREE.ConeGeometry(),
                         new THREE.MeshBasicMaterial({color:0xffffff})
                         );

const agent4 = new Agent(parameters, new THREE.Vector3(9,9,9));
const agent5 = new Agent(parameters, new THREE.Vector3(-9,-9,-9));
const agent6 = new Agent(parameters, new THREE.Vector3(-9,9,-9));
const agent7 = new Agent(parameters, new THREE.Vector3(-9,9,9));
const agent8 = new Agent(parameters, new THREE.Vector3(-12,19,9));

//world.add(new Agent(new THREE.Vector3(), new THREE.Vector3()));

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

const make = (speed, hexColor, customSettings = null) => {
  world.add(
    new Agent(customSettings === null ? parameters : customSettings,
              new THREE.Vector3(1,0,1), 
	      new THREE.Vector3(0,1,0),
	      speed,
              new THREE.ConeGeometry(),
              new THREE.MeshBasicMaterial({color:hexColor})
              )
    );
};

const state = {
  color: '#ffffff', 
  speed: 0.3,
  aversion: 0.25,
  correlation: 0.1,
  cohesion: 0.08,
  personalSpace: 4,
  sightRadius: 15,
  add: () => make(state.speed, state.color, null),
  addWithCustomBehavior: () => make(state.speed, state.color, 
                                           {
				            aversion: state.aversion,
                                            correlation: state.correlation,
				            cohesion: state.cohesion,
				            personalSpace: state.personalSpace,
				            sightRadius: state.sightRadius
                                           }
				   ),
  reset: () => world.reset(),
  x: 0,
  y: 0,
  z: 0
};

const create = gui.addFolder('create agent');
create.add(state, 'color');
create.add(state, 'speed', 0.01 , 1);
create.add(state, 'add');
create.add(state, 'addWithCustomBehavior');

const behavior = gui.addFolder('alter universal behavior');
behavior.add(parameters, 'aversion',0 , 1, 0.001);
behavior.add(parameters, 'correlation', 0, 1, 0.001);
behavior.add(parameters, 'cohesion', 0, 1, 0.001);
behavior.add(parameters, 'personalSpace', 0, 15, 0.1)
behavior.add(parameters, 'sightRadius', 0, 30, 0.1)


const customBehavior = create.addFolder('specialize behavior in agent creation');
create.add(state, 'aversion',0 , 1, 0.001);
create.add(state, 'correlation', 0, 1, 0.001);
create.add(state, 'cohesion', 0, 1, 0.001);
create.add(state, 'personalSpace', 0, 15, 0.1)
create.add(state, 'sightRadius', 0, 30, 0.1)

gui.add(state ,'reset');

const dev = gui.addFolder('dev');
var optX = dev.add(state, 'x', 0.0 , 2 * Math.PI, 0.1);
optX.onChange(() => world.agents.map((a) => a.body.rotation.x = state.x));
var optY = dev.add(state, 'y', 0.0 , 2 * Math.PI, 0.1);
optY.onChange(() => world.agents.map((a) => a.body.rotation.y = state.y));
var optZ = dev.add(state, 'z', 0.0 , 2 * Math.PI, 0.1);
optZ.onChange(() => world.agents.map((a) => a.body.rotation.z = state.z));





world.simulate()
