import * as THREE from "three";
import { randomColorHex } from "../../utils";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';
import SelectionHelper from './SelectionHelper';

const updateCamera = (camera, controls, nodeMesh) => {
    const {x, y, z} = nodeMesh.position;
   
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
    controls.enablePan = false;
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

    // setup selection box

    const selectionBox = new SelectionBox( camera, scene );
    const helper = new SelectionHelper( selectionBox, renderer, 'selectBox' );

    document.addEventListener('keydown', (e) => {
        if (e.key == 'Shift') {
            helper.enable = true;
            console.log(helper)
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key == 'Shift') {
            helper.enable = false;
        }
    })


    document.addEventListener( 'pointerdown', function ( event ) {
        let bounds = canvas.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        console.log(x, y)

        for ( const item of selectionBox.collection ) {

            item.material.emissive.set( 0x000000 );

        }

        selectionBox.startPoint.set(
            ( x / bounds.width ) * 2 - 1,
            - ( y / bounds.height ) * 2 + 1,
            0.5 );

    } );

    document.addEventListener( 'pointermove', function ( event ) {
        if ( helper.isDown ) {

            for ( let i = 0; i < selectionBox.collection.length; i ++ ) {

                selectionBox.collection[ i ].material.emissive.set( 0x000000 );

            }

            selectionBox.endPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );

            const allSelected = selectionBox.select();

            for ( let i = 0; i < allSelected.length; i ++ ) {

                allSelected[ i ].material.emissive.set( 0xffffff );

            }

        }

    } );

    document.addEventListener( 'pointerup', function ( event ) {
        let bounds = canvas.getBoundingClientRect();
        let x = event.clientX - bounds.left;
        let y = event.clientY - bounds.top;
        selectionBox.endPoint.set(
            ( x / bounds.width ) * 2 - 1,
            - ( y / bounds.height ) * 2 + 1,
            0.5 );

        const allSelected = selectionBox.select();

        for ( let i = 0; i < allSelected.length; i ++ ) {

            allSelected[ i ].material.emissive.set( 0xffffff );

        }

    } );

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
