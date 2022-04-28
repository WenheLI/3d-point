import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';
import data2D from '../../../data/pca_umap_outputs_with_metadata_Edgar.json';
import './PointCloud.css';


function PointCloud({ node, style, setNode }) {
    const canvasRef = useRef(null);
    const canvas2DRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);
    const nodePool = useRef(null);
    const [display, setDisplay] = useState("");
    const [display2D, setDisplay2D] = useState("none");
    const [buttonLabel, setLabel] = useState("2D");


    useEffect(() => {
        if (canvasRef.current !== null) {
            const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
                main(canvasRef.current, oriData, style.canvasRatio, 
                        style.backgroundColor, setNode, true, true);
            camera.current = localCam;
            controls.current = localControl;
            nodePool.current = localNodePool;
        }
    }, [canvasRef]);

    useEffect(() => {
        if (canvas2DRef.current !== null) {
            const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
                main(canvas2DRef.current, data2D, style.canvasRatio, 
                        style.backgroundColor, setNode, false, true);
            camera.current = localCam;
            controls.current = localControl;
            nodePool.current = localNodePool;
        }

    }, [canvas2DRef]);

    useEffect(() => {
        if (node !== null && camera.current && controls.current && nodePool.current[node]) {
            updateCamera(camera.current, controls.current, nodePool.current[node]);
        }
    }, [node])

    return (
        <div>
            <button onClick={() => {
                if (display === "") {
                    setDisplay("none");
                    setDisplay2D("");
                    setLabel("3D");
                } else {
                    setDisplay("");
                    setDisplay2D("none");
                    setLabel("2D");
                }
            }}> 
                {buttonLabel}
            </button>

            <div ref={canvasRef} style={{
                width: style.width,
                height: style.height,
                display: display,
            }}></div>

            <div ref={canvas2DRef} style={{
                width: style.width,
                height: style.height,
                display: display2D,
            }}></div>
        </div>
        
    )
}
export default PointCloud;
