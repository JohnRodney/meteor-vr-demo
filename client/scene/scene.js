/*          FUNCTIONS
// run()        looks for the Meteor.VR object to be created
//
// makeScene()  setup objects and then register Call backs
//
// registerCallBacks(cubes, light): register functions to be called in the animation loop
//     accepts cubes: an array of cube meshes
//     accepts light: the light object
//
// fillCubes(length):         create an array of cubes and add to the scene then return the array for callbacks
//     accepts length: sets the length of the cubes array that is returned
//
// addLight(pos, color, intensity):     adds a point light to the scene
//     accepts pos: a vector3 with x, y, and z values
//     accepts color: the color to set the light to shine
//     intensity: how far the light will shine
//
// makeTriangle(follower, leader);      creates a trailing triangle behind the user;
//     accepts follower: the position of the mesh following
//     accepts leader: the position of the mesh leading
//
// getSphere(): returns a sphereObject
//
// getCoord(): returns a single randomly generated coordinate
//
// vector3(x, y, z): an object with an x, y, and z property
*/
run();

function run(){
  if(typeof(Meteor.VR) === 'undefined'){
    setTimeout(run, 500);
  }
  else{
    makeScene();
  }
}

function makeScene(){
  var cubes = fillCubes(1000),
      light = addLight(new vector3(0, 0, 0), 0xff0000, 1000);

  registerCallBacks(cubes, light);

  Meteor.VR.animate();
}

function registerCallBacks(cubes, light){
  Meteor.VR.addCallBack(function(){
    cubes.forEach(function(cube){
      cube.mesh.rotation.x += 0.1;
      cube.mesh.position = makeTriangle(cube.mesh.position, Meteor.VR.camera.position);
    });

    Meteor.VR.camera.position.z -= 0.04;
    Meteor.VR.camera.position.x -= 0.03;
    Meteor.VR.camera.position.y -= 0.04;

    light.position = Meteor.VR.camera.position;
  });
}

function fillCubes(l){
  var length = l,
      cubes = [];

  for(x = 0; x < length; x++){
    var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1),
        material = new THREE.MeshNormalMaterial(),
        cube = {};

    cube.mesh = new THREE.Mesh(geometry, material),
    cube.acceleration = new vector3(0, 0, 0);

    cube.mesh.position.set(getCoord(), getCoord(), getCoord());
    Meteor.VR.scene.add(cube.mesh);
    cubes.push(cube);
  }

  return cubes;
}

function addLight(pos, color, intensity){

  var light = new THREE.PointLight(color , 1, intensity);

  light.position.set(pos.x, pos.y, pos.z);
  Meteor.VR.scene.add(light);

  return light;

}

function accelerate(obj, speed){
  var a = obj.accleration,
      p = obj.position;

  a.x > 0 ? p.x += speed : p.x -= speed;
  a.y > 0 ? p.y += speed : p.y -= speed;
  a.z > 0 ? p.z += speed : p.z -= speed;

  return obj;
}

function makeTriangle(follower, leader){

  var speed = 0.01 * Math.PI;

  if(Math.abs(follower.z - leader.z) > 10){
    speed = 0.1;
  }
  if(follower.x < leader.x){
    follower.x += speed*2;
    return follower;
  }
  if(follower.y < leader.y){
    follower.y += speed;
    return follower;
  }
  if(follower.z < leader.z){
    follower.z += speed;
    return follower;
  }
  follower.y -= speed;
  follower.z -= speed;
  follower.x -= speed;

  return follower;
}

function getSphere(){

  var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});

  return new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    sphereMaterial
  );

}

function getCoord(){
  return (Math.random()*10)-5;
}

function vector3(X, Y, Z){
  this.x = X;
  this.y = Y;
  this.z = Z;
}

