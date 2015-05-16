window.onload = function(){
    Meteor.VR = {};
    //Setup three.js WebGL renderer
    Meteor.VR.renderer = new THREE.WebGLRenderer({ antialias: true });
    Meteor.VR.renderer.setPixelRatio(window.devicePixelRatio);

    // Append the canvas element created by the renderer to document body element.
    document.body.appendChild(Meteor.VR.renderer.domElement);

    // Create a three.js scene.
    Meteor.VR.scene = new THREE.Scene();

    // Create a three.js camera.
    Meteor.VR.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);

    // Apply VR headset positional data to camera.
    Meteor.VR.controls = new THREE.VRControls(Meteor.VR.camera);

    // Apply VR stereo rendering to renderer.
    Meteor.VR.effect = new THREE.VREffect(Meteor.VR.renderer);
    Meteor.VR.effect.setSize(window.innerWidth, window.innerHeight);

    // Create a VR manager helper to enter and exit VR mode.
    Meteor.VR.manager = new WebVRManager(Meteor.VR.renderer, Meteor.VR.effect, {hideButton: false});


    Meteor.VR.callbacks = [];

    Meteor.VR.addCallBack = function(callback){
      Meteor.VR.callbacks.push(callback);
    }
    // Request animation frame loop function
    Meteor.VR.animate = function() {

      Meteor.VR.callbacks.forEach(function(callback, i){
        callback();
      });
      // Update VR headset position and apply to camera.
      Meteor.VR.controls.update();

      // Render the scene through the manager.
      Meteor.VR.manager.render(Meteor.VR.scene, Meteor.VR.camera);

      requestAnimationFrame(Meteor.VR.animate);
    }


    // Reset the position sensor when 'z' pressed.
    function onKey(event) {
      if (event.keyCode == 90) { // z
        controls.resetSensor();
      }
    };

    window.addEventListener('keydown', onKey, true);

    // Handle window resizes
    function onWindowResize() {
      Meteor.VR.camera.aspect = window.innerWidth / window.innerHeight;
      Meteor.VR.camera.updateProjectionMatrix();

      Meteor.VR.effect.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener('resize', onWindowResize, false);
  }

