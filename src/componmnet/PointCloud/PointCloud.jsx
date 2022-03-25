import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';


function PointCloud({ node }) {
    const canvasRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);
    const nodePool = getNodePool();


    function getNodePool() {
        const nodePool = {};
        oriData.forEach(element => {
            nodePool[element.id] = {
                "umap1": element.umap1, 
                "umap2": element.umap2, 
                "umap3": element.umap3}
        });
        return nodePool;
    }

    useEffect(() => {
        if (canvasRef.current !== null) {
            const {camera: localCam, controls: localControl} = main(canvasRef.current, oriData, .45);
            camera.current = localCam;
            controls.current = localControl;
        }
    }, [canvasRef]);

    useEffect(() => {
        if (node !== null) {
            updateCamera(camera.current, controls.current, nodePool[node]);
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
