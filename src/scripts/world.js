import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

class World {
  constructor(from = new THREE.Vector3(-10,-10,-10), 
              to = new THREE.Vector3(10,10,10) //assuming components are all greater than from
             ){                                //TODO: Enforce the above
    if(! World.singleton){
      this.from = from;
      this.to = to;
      World.singleton = this;
    }
    return World.singleton;
  };  
  //Returns coefficients that flip the component if it's out of bounds
  //TODO: Make this cleaner
  outOfBounds(position){
    const xValid = this.from.x < position.x && position.x < this.to.x ? 1 : -1;
    const yValid = this.from.y < position.y && position.y < this.to.x ? 1 : -1;
    const zValid = this.from.z < position.z && position.z < this.to.x ? 1 : -1;
    return new THREE.Vector3(xValid,yValid,zValid);
  };
}

export {World};

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

