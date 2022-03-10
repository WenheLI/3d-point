import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { Graph } from 'igraph-wasm';
import { prepareMaterial } from '../../utils';

const main = async (canvas, data) => {
    let edges = data.links.map((it) => {
        return [it.source, it.target];
    }).flat();

    const G = new Graph();
    await G.init();
    
    const graph = G.createInstance();

    graph.feed(edges, data.nodes.length);
    graph.kamadaKawai3DLayout(200, .9, 12);
    // else if (layout == 1) graph.sphereLayout();

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
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    canvas.appendChild(renderer.domElement);

    const controls = new OrbitControls( camera, renderer.domElement );

    const materialPool = prepareMaterial(data);

    const geometry = new THREE.SphereGeometry(.5);

    const spherePool = {};
    // drawNodes
    let i = 0
    for (const node of data.nodes) {
        const sphere = new THREE.Mesh(geometry, materialPool[node.group]);
        const pos = graph.queryPoint(i, 3);
        sphere.position.x = pos[0] * 10;
        sphere.position.y = pos[1] * 10;
        sphere.position.z = pos[2] * 10;
        scene.add(sphere);
        sphere.userData = {
            'id': node.id,
            'lineAsSource': [],
            'lineAsTarget': []
        }
        spherePool[node.id] = sphere;
        i += 1;
    }
    const dragControl = new DragControls(Object.values(spherePool), camera, renderer.domElement);

    const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );

    // drawLines
    for (const link of data.links) {
        const sphere1 = spherePool[link.source];
        const sphere2 = spherePool[link.target];
        const lineGeometry = new THREE.BufferGeometry();
        lineMaterial.opacity = link.value * 0.1;
        lineGeometry.setFromPoints([sphere1.position, sphere2.position]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        sphere1.userData.lineAsSource.push([line, sphere2]);
        sphere2.userData.lineAsTarget.push([line, sphere1]);
    }

    dragControl.addEventListener('dragstart', (e) => {
        controls.enabled = false;
    });

    dragControl.addEventListener('drag', (e) => {
        for (const [line, sphere] of e.object.userData.lineAsSource) {
            line.geometry.setFromPoints([e.object.position, sphere.position]);
        }
        for (const [line, sphere] of e.object.userData.lineAsTarget) {
            line.geometry.setFromPoints([sphere.position, e.object.position]);
        }
    })

    dragControl.addEventListener('dragend', (e) => {
        controls.enabled = true;
    });

    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    };

    animate();

    return [spherePool, graph];
}

export {
    main
}