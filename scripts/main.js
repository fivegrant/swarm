import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GUI } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/libs/dat.gui.module';

/*
* import { ItemToImport } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/...';
* ^ This is how we can snag other functionality from three.js
*/

import { World } from '/swarm/scripts/world.js';
import { Agent } from '/swarm/scripts/agent.js';

const parameters = {
  aversion: 0.25,
  correlation: 0.1,
  cohesion: 0.08,
  personalSpace: 4,
  sightRadius: 15,
}

const world = new World()
// Init default scene
const agent = new Agent(parameters);
const agent2 = new Agent(parameters,
                         new THREE.Vector3(1,0,1), 
	                 new THREE.Vector3(0,1,0),
			 0.1,
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
};

const create = gui.addFolder('agent creation');
create.add(state, 'color');
create.add(state, 'speed', 0.01 , 1);
const addAgent = create.add(state, 'add');
addAgent.name('add agent');


const behavior = gui.addFolder('universal behavior');
behavior.add(parameters, 'aversion',0 , 1, 0.001);
behavior.add(parameters, 'correlation', 0, 1, 0.001);
behavior.add(parameters, 'cohesion', 0, 1, 0.001);
behavior.add(parameters, 'personalSpace', 0, 15, 0.1)
behavior.add(parameters, 'sightRadius', 0, 30, 0.1)


const customBehavior = create.addFolder('behavior customization');
customBehavior.add(state, 'aversion',0 , 1, 0.001);
customBehavior.add(state, 'correlation', 0, 1, 0.001);
customBehavior.add(state, 'cohesion', 0, 1, 0.001);
customBehavior.add(state, 'personalSpace', 0, 15, 0.1)
customBehavior.add(state, 'sightRadius', 0, 30, 0.1)
const addAgentSpecial = customBehavior.add(state, 'addWithCustomBehavior');
addAgentSpecial.name('add special agent');

const options = gui.addFolder('options');
const reset = options.add(state, 'reset');
const pause = options.add(world.options, 'pause');

world.simulate()
