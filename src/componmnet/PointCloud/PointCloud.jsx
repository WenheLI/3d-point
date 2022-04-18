import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';
import './PointCloud.css';


function PointCloud({ node, cloudStyle }) {
    const canvasRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);
    const nodePool = useRef(null);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const {camera: localCam, controls: localControl, nodePool: localNodePool} = main(canvasRef.current, oriData, cloudStyle.canvasRatio, cloudStyle.backgroundColor);
            camera.current = localCam;
            controls.current = localControl;
            nodePool.current = localNodePool;
        }
    }, [canvasRef]);

    useEffect(() => {
        if (node !== null && camera.current && controls.current && nodePool.current[node]) {
            updateCamera(camera.current, controls.current, nodePool.current[node]);
        }
    }, [node])

    return (
        <div ref={canvasRef} style={{
            width: cloudStyle.width,
            height: cloudStyle.height,
        }}></div>
    )
}
export default PointCloud;
