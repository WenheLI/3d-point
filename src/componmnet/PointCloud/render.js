import * as THREE from "three";
import { randomColorHex } from "../../utils";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const updateCamera = (camera, controls, posValues) => {
    if (camera && posValues) {
        camera.position.set(posValues.umap1, posValues.umap2, posValues.umap3 - 1.5);
        const nodePos = new THREE.Vector3(posValues.umap1, posValues.umap2, posValues.umap3);
        camera.lookAt(nodePos);
        controls.target = nodePos;
        controls.update();
    }
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

    const spherePool = {};

    for (let i = 0; i < data.length; i++) {
        spherePool[i] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: randomColorHex(),
        }));
        spherePool[i].position.x = data[i].umap1;
        spherePool[i].position.y = data[i].umap2;
        spherePool[i].position.z = data[i].umap3;
        scene.add(spherePool[i]);
    }

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

    return {camera, controls};
}

export {
    main,
    updateCamera
}
