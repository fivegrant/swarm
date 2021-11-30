# Swarm (Boid Playground)

## Description
*Swarm* is an environment where the user can introduce boid
with custom parameters and observe the behavior that 
emerges. Please note that this
particular implementation does not have a cardinal floor 
so the boids have no gravity affecting them.

## Usage

### Mouse
- Scroll: Zoom in/out.
- Left Click (Drag): Rotate
- Right Click (Drag): Pan

### GUI
- **Agent Creation**:
    - `add agent`: spawns agent using the current parameters set. (Note
    that the agent will use the universal behavior.)
    - `color`: takes a hexadecimal color in the form "#xxxxxx" and
    sets the `add agent` to generate boids with the corresponding color.
    (Make sure to include the `#` in the string.)
    - `speed`: sets the velocity of the next agents spawned
    - `behavior customization`: contains all the constants
      that affect behavior. The constants include
        - `aversion`: avoidance of other agents.
        - `correlation`: velocity matching of neighbors.
        - `cohesion`: tendency towards the center of neighbors.
        - `personalSpace`: the radius of the circle that represents collisions.
        - `sightRadius`: the radius of the circle of visible boids.
    - `add special agent`: spawns an agent that uses the `behavior customization`
      options instead of the universal behvior options.

- **Universal Behavior**: contains identical constants to 
`behavior customization`, however, changes affect all
boids not created by `add special agent`.

- **Options**:
    - `reset`: destroys all current boids.
    - `pause`: toggle checkbox that pause/plays the simulation.



### Running Swarm 
If you don't want to run it yourself, [it's hosted here](https://fivegrant.github.io/swarm).
The project is a static site so any http server that serves
the `index.html` will do. I use and personally recommend 
[simple-http-server](https://github.com/TheWaWaR/simple-http-server).
If you are using **simple-http-server**,
just run (in the root directory of this project):
```
simple-http-server -i
```

## Misc 
**This project ...**

- ... implements many of the ideas found in 
  [Reynold's original paper about the boids](http://www.cs.toronto.edu/~dt/siggraph97-course/cwr87/).
  This was the only source on the boids used.
  Newer or different approaches were not considered.
  Additionally, the goals of this project are different
  than the paper.

- ... was created for Jim Mahoney's [Coding Workshop](https://cs.bennington.college/courses/fall2021/coding/home)
  class from the Fall of 2021.

- ... heavily relies on [three.js](https://threejs.org/),
  a really good layer over WebGL. Thanks three.js!
