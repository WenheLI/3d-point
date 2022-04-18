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

const main = (canvas, data, ratio, backgroundColor) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    const color = 0xdbdbdb;
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
        nodePool[data[i].id].userData = {
            'label': data[i].id,
        }
        scene.add(nodePool[data[i].id]);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.render(scene, camera);

    // raycasting for showing text
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector3();
    let mouseX = null;
    let mouseY = null;
    let lastLabel = "";

    function onMouseMove(event) {
        let elem = renderer.domElement;
        let boundingRect = elem.getBoundingClientRect();

        let x = (event.clientX - boundingRect.left);
        let y = (event.clientY - boundingRect.top);
        mouse.x = (x / boundingRect.width) * 2 - 1;
        mouse.y = - (y / boundingRect.height) * 2 + 1;
        mouse.z = 0.5;
        raycaster.setFromCamera(mouse, camera);

        mouseX = event.clientX;
        mouseY = event.clientY;

    }
    canvas.addEventListener('mousemove', onMouseMove);

    function render() {
        const intersects = raycaster.intersectObjects( scene.children );


        if (intersects.length > 0) {
            const curLabel = intersects[0].object.userData['label'];
            if (curLabel !== lastLabel) {
                let hovIn = new CustomEvent('clientHovIn', {
                    detail: {x: mouseX, y: mouseY, label: curLabel}
                }); 
                document.dispatchEvent(hovIn);
                lastLabel = curLabel;
            }
        } else {
            const curLabel = "";
            if (curLabel !== lastLabel) {
                const hovOut = new CustomEvent('clientHovOut', {});
                document.dispatchEvent(hovOut);
                lastLabel = curLabel;
            }

        }
        
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        renderer.render(scene, camera);
    };

    animate();

    return {camera, controls, nodePool};
}

export {
    main,
    updateCamera
}
