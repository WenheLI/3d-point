import * as THREE from "three";

function preprocess(data) {
    const memo = {}
    for (const node of data.nodes) {
        //@ts-ignore
        //@ts-ignore
        if (!memo[node.id]) {
            // @ts-ignore
            memo[node.id] = Object.keys(memo).length;
        }
    }
    const newData = {
        nodes: data.nodes.map((node) => {
            //@ts-ignore
            node.id = memo[node.id];
            return node;
        }),
        links: data.links.map((link) => {
            //@ts-ignore
            link.source = memo[link.source];
            //@ts-ignore
            link.target = memo[link.target];
            return link;
        })
    }
    return newData
}

function randomColorHex() {
    // generate only dark color
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += Math.floor(Math.random() * 10);
    }
    return color;
}

const prepareMaterial = (data) => {
    const materialPool = {};
    const groups = new Set(data.nodes.map((it) => it.group));
    groups.forEach((it) => {
        materialPool[it] = new THREE.MeshPhongMaterial({
            color: randomColorHex(),
        });
    })

    return materialPool;
}

export {
    preprocess,
    prepareMaterial,
    randomColorHex
}