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

const mockData = {
    data: {"1102952_EAV516015_Restaging_Batch 3.fcs": -0.396529312676444,
           "1102952_EAV516045_Baseline_Batch 3.fcs": 2.0006758945345,
           "1102952_EAV516051_Pre_Day_1_Cycle_2_Batch 3.fcs": 2.33109428626858},
    mapper: {},
    minVal: -0.396529312676444,
    maxVal: 2.33109428626858
}

const getGroupMaterial = (mapper) => {
    const materialPool = {};
    const groups = Object.keys(mapper);
    groups.forEach((it) => {
        materialPool[it] = new THREE.MeshPhongMaterial({
            color: randomColorHex(),
        });
    })

    return materialPool;
}

const generateGredientColor = (colorNumber, material, rainbow) => {
    color = rainbow.colourAt(colorNumber);
    color = `#${color}`;
    material.color = color;
}

const generateCategoryColor = (colorNumber, material, materialPool) => {
    material = materialPool[colorNumber];
}

export {
    preprocess,
    prepareMaterial,
    randomColorHex
}