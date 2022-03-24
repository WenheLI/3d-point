import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';


function PointCloud({ node }) {
    console.log(node)
    const canvasRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);

    String.prototype.replaceAt = function(index, replacement) {
        return this.substring(0, index) + replacement + this.substring(index + replacement.length);
    }

    function getNodeByCode(id) {
        return oriData.filter(
            function(oriData){ return oriData.id == id }
        );
    }

    useEffect(() => {
        if (canvasRef.current !== null) {
            const {camera: localCam, controls: localControl} = main(canvasRef.current, oriData, .45);
            camera.current = localCam;
            controls.current = localControl;
            console.log(camera, controls)
        }
    }, [canvasRef]);

    useEffect(() => {
        // if (node.substring(node.size() - 5, node.size()))
        if (node !== null) {
            const len = node.length
            let newNode = node
            if (newNode.substring(len - 4, len) === ".fcs") {
                newNode = newNode.replaceAt(len - 6, '.');
            }
            const values = Object.values(getNodeByCode(newNode)[0])
            updateCamera(camera.current, controls.current, values);
            // console.log(values[3]);
        }
    }, [node])

    return (
        <div ref={canvasRef} style={{
            width: '45%',
            height: '45%',
            left: '50%',
            position: 'absolute',
        }}></div>
    )
}
export default PointCloud;