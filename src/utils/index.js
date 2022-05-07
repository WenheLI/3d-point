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
    let color = '0x';
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

const getGroupColor = (mapper) => {
    const colorPool = {};
    colorPool['0'] = '0x0000ff';
    colorPool['1'] = '0xff00ff';
    // set random color for each attribute; leave for future usage
    // const groups = Object.keys(mapper);
    // groups.forEach((it) => {
    //      colorPool[it] = randomColorHex();
    // })

    return colorPool;
}

const generateGredientColor = (data, nodePool, rainbow) => {
    data.data.forEach(elem => {
        color = rainbow.colourAt(elem.num);
        color = `0x${color}`;
        nodePool[elem.id].material.color.setHex(color);
    })
}

const generateCategoryColor = (data, nodePool) => {
    const colorPool = getGroupColor(data.cat_mapper);
    data.data.forEach(elem => {
        nodePool[elem.id].material.color.setHex(colorPool[elem.cat]);
    })
    return colorPool;
}

const generateRandomColor = (nodePool) => {
    Object.values(nodePool).forEach(val => val.material.color.setHex(randomColorHex()));
}

export {
    preprocess,
    prepareMaterial,
    randomColorHex,
    generateGredientColor,
    generateCategoryColor,
    generateRandomColor
}