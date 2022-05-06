// TODO: The whole file should be refactored into a render manager class
import * as THREE from "three";
import { randomColorHex } from "../../utils";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';
import SelectionHelper from './SelectionHelper';
import Rainbow from 'rainbowvis.js'

import { BrightYellow } from '../../utils/constants';

const updateCamera = (camera, controls, nodeMesh) => {
    let {x, y, z} = nodeMesh.position;

    camera.position.set(x, y, z - 1.5);
    const nodePos = new THREE.Vector3(x, y, z);
    camera.lookAt(nodePos);
    controls.target = nodePos;
    controls.update();
}

const restoreHighlight = (nodeMesh) => {
    nodeMesh.material.color.setHex(nodeMesh.userData.color);
    nodeMesh.material.wireframe = false;
}

const highlightNode = (nodeMesh) => {
    if (nodeMesh.material.wireframe) return ;
    nodeMesh.userData.color = nodeMesh.material.color.getHex();
    nodeMesh.material.color.setHex(BrightYellow);
    nodeMesh.material.wireframe = true;
}

const main = (canvas, data, ratio, backgroundColor, setNodes, is3d, colorRand) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    const color = 0xffffff;
    const intensity = 1.2;

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

    let myRainbow = new Rainbow();
    myRainbow.setNumberRange(0, 1);
    myRainbow.setSpectrum('#FE0002', '#0302FC');

    for (let i = 0; i < data.length; i++) {
        let color = null;
        if (colorRand) {
            color = randomColorHex();
        } else {
            color = myRainbow.colourAt(Math.random());
            color = `0x${color}`; 
        }
        
        nodePool[data[i].id] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
        nodePool[data[i].id].material.color.setHex(color)

        nodePool[data[i].id].position.x = data[i].umap1;
        nodePool[data[i].id].position.y = data[i].umap2;
 
        nodePool[data[i].id].position.z = data[i].umap3 ? data[i].umap3 : 0.5;
        nodePool[data[i].id].userData = {
            'label': data[i].id,
        }
        scene.add(nodePool[data[i].id]);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    if (!is3d) {
        controls.enableRotate = false;
        controls.enablePan = true;
    }
    renderer.render(scene, camera);

    // raycasting for showing text
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector3();
    let boundingRect = renderer.domElement.getBoundingClientRect();
    let mouseX = null;
    let mouseY = null;
    let lastLabel = '';

    function onMouseMove(event) {
        let x = (event.clientX - boundingRect.left);
        let y = (event.clientY - boundingRect.top);
        mouse.x = (x / boundingRect.width) * 2 - 1;
        mouse.y = - (y / boundingRect.height) * 2 + 1;
        mouse.z = 0;
        raycaster.setFromCamera(mouse, camera);

        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    canvas.addEventListener('mousemove', onMouseMove);

    function renderLabel() {
        const intersects = raycaster.intersectObjects( scene.children );
        let hovEvent = undefined;
        let curLabel;

        if (intersects.length > 0) {
            curLabel = intersects[0].object.userData['label'];
            if (curLabel !== lastLabel) {
                hovEvent = new CustomEvent('clientHovIn', {
                    detail: {x: mouseX, y: mouseY, label: curLabel}
                }); 
            }
        } else {
            curLabel = '';
            if (curLabel !== lastLabel) {
                hovEvent = new CustomEvent('clientHovOut', {});
            }
        }
        if (hovEvent) {
            document.dispatchEvent(hovEvent);
            lastLabel = curLabel;  
            hovEvent = undefined;
        }
    }

    // setup selection box
    const selectionBox = new SelectionBox( camera, scene );
    const helper = new SelectionHelper( selectionBox, renderer, 'selectBox' );

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Shift') {
            helper.enable = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key == 'Shift') {
            helper.enable = false;
        }
    })


    canvas.addEventListener( 'pointerdown', function ( event ) {
        if (!helper.enable) return ;
        let x = event.clientX - boundingRect.left;
        let y = event.clientY - boundingRect.top;

        for ( const item of selectionBox.collection ) {
            item.material.emissive.set( 0x000000 );
        }

        selectionBox.startPoint.set(
            ( x / boundingRect.width ) * 2 - 1,
            - ( y / boundingRect.height ) * 2 + 1,
            0.5 );
    });

    canvas.addEventListener( 'pointerup', function ( event ) {
        if (!helper.enable) return ;
        let bounds = canvas.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        selectionBox.endPoint.set(
            ( x / bounds.width ) * 2 - 1,
            - ( y / bounds.height ) * 2 + 1,
            0.5 );

        const allSelected = selectionBox.select();
        
        const selectNodes = []

        for ( let i = 0; i < allSelected.length; i ++ ) {
            allSelected[i].material.emissive.set( 0xffffff );
            selectNodes.push(allSelected[i].userData['label']);
        }

        setNodes(selectNodes);

    } );

    function animate() {
        requestAnimationFrame(animate);
        renderLabel();
        renderer.render(scene, camera);
    };

    animate();

    return {camera, controls, nodePool};
}

export {
    main,
    highlightNode,
    restoreHighlight,
    updateCamera
}
