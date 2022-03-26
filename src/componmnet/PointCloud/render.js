import * as THREE from "three";
import { randomColorHex } from "../../utils";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const updateCamera = (camera, controls, nodeMesh) => {
    x = nodeMesh.position.x;
    y = nodeMesh.position.y;
    z = nodeMesh.position.z;
    camera.position.set(x, y, z - 1.5);
    const nodePos = new THREE.Vector3(x, y, z);
    camera.lookAt(nodePos);
    controls.target = nodePos;
    controls.update();
}

const main = (canvas, data, ratio) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111f0f);
    const color = 0xffffff;
    const intensity = 2;

    const ambientLight = new THREE.AmbientLight(color, intensity);

    const light = new THREE.PointLight(color, intensity);

    light.position.z = -10;
    light.position.x = 10;
    light.position.y = 10;
    scene.add(light);
    scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth * ratio / (window.innerHeight * ratio), 0.1, 1000 );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * ratio, window.innerHeight * ratio);
    canvas.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(.05);

    const nodePool = {};

    for (let i = 0; i < data.length; i++) {
        nodePool[data[i].id] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: randomColorHex(),
        }));
        nodePool[data[i].id].position.x = data[i].umap1;
        nodePool[data[i].id].position.y = data[i].umap2;
        nodePool[data[i].id].position.z = data[i].umap3;
        scene.add(nodePool[data[i].id]);
    }

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

    return {camera, controls, nodePool};
}

export {
    main,
    updateCamera
}
