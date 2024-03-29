var container;
var camera, scene, renderer;
var mesh;
var sign = 1;
init();
animate();
function init() {
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.2,
    100
  );
  camera.position.set(0, 5, 5);
  scene = new THREE.Scene();
  var light = new THREE.PointLight(0xff2200, 0.7);
  light.position.set(100, 100, 100);
  scene.add(light);
  light = new THREE.PointLight(0x22ff00, 0.7);
  light.position.set(-100, -100, -100);
  scene.add(light);
  light = new THREE.AmbientLight(0x111111);
  scene.add(light);
  var loader = new THREE.GLTFLoader();
  loader.load('AnimatedMorphSphere.gltf', function(gltf) {
    gltf.scene.traverse(function(node) {
      if (node.isMesh) mesh = node;
    });
    mesh.material.morphTargets = true;
    mesh.rotation.z = Math.PI / 2;
    //mesh.material.visible = false;
    scene.add(mesh);
    //
    var pointsMaterial = new THREE.PointsMaterial({
      size: 10,
      sizeAttenuation: false,
      map: new THREE.TextureLoader().load('disc.png'),
      alphaTest: 0.5,
      morphTargets: true
    });
    var points = new THREE.Points(mesh.geometry, pointsMaterial);
    points.morphTargetInfluences = mesh.morphTargetInfluences;
    points.morphTargetDictionary = mesh.morphTargetDictionary;
    mesh.add(points);
  });
  //
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  //
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 20;
  //
  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  if (mesh !== undefined) {
    mesh.rotation.y += 0.01;
    mesh.morphTargetInfluences[1] = mesh.morphTargetInfluences[1] + 0.01 * sign;
    if (
      mesh.morphTargetInfluences[1] <= 0 ||
      mesh.morphTargetInfluences[1] >= 1
    ) {
      sign *= -1;
    }
  }
  renderer.render(scene, camera);
}
