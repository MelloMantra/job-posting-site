/* 
Useful Links:
https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html
https://threejs.org/examples/#webgl_geometry_text
https://www.techvoot.com/blog/animate-3d-model-using-three-js
https://www.theatrejs.com/
https://threejs.org
*/

import * as THREE from 'three';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera (Field of View, Aspect Ratio, Near, Far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// Create a renderer and attach it to the document
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha makes background transparent
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );

const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new TextGeometry('My Logo', {
        font: font,
        size: 2,       // Size of the text
        height: 0.5,   // Depth
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
    });

    const material = new THREE.MeshStandardMaterial({ color: 0xff0055 });
    const textMesh = new THREE.Mesh(textGeometry, material);

    scene.add(textMesh);
    textMesh.position.set(-4, 0, 0); // Adjust text position
});

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();