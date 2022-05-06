import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera, restoreHighlight, highlightNode } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';
import data2D from '../../../data/pca_umap_outputs_with_metadata_Edgar.json';
import './PointCloud.css';
import Panel from './Panel';
import { CameraOutlined, PlusSquareFilled, MinusSquareFilled } from '@ant-design/icons';
import { Button } from 'antd';

function PointCloud({ node, style, setNode, setUI, regionSelectNodes}) {
    // TODO Optimize the code
    const canvasRef = useRef(null);
    const canvas2DRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);
    const nodePool = useRef(null);
    const camera2D = useRef(null);
    const controls2D = useRef(null);
    const nodePool2D = useRef(null);

    const [is3D, setIs3D] = useState(true);

    const [prevHighlight, setPrevHighlight] = useState(new Set());

    const renderCanvas = (ref, data, stateCam, stateControl, stateNodePool, is3D) => {
        if (ref.current !== null) {
            const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
                main(ref.current, data, style.canvasRatio, 
                        style.backgroundColor, setNode, is3D, true);
            stateCam.current = localCam;
            stateControl.current = localControl;
            stateNodePool.current = localNodePool;
        }
    }

    useEffect(() => {
        renderCanvas(canvasRef, oriData, camera, controls, nodePool, true);
        // if (canvasRef.current !== null) {
        //     const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
        //         main(canvasRef.current, oriData, style.canvasRatio, 
        //                 style.backgroundColor, setNode, true, true);
        //     camera.current = localCam;
        //     controls.current = localControl;
        //     nodePool.current = localNodePool;
        // }
    }, [canvasRef]);

    useEffect(() => {
        renderCanvas(canvas2DRef, data2D, camera2D, controls2D, nodePool2D, false);
        // if (canvas2DRef.current !== null) {
        //     const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
        //         main(canvas2DRef.current, data2D, style.canvasRatio, 
        //                 style.backgroundColor, setNode, false, true);
        //     camera2D.current = localCam;
        //     controls2D.current = localControl;
        //     nodePool2D.current = localNodePool;
        // }

    }, [canvas2DRef]);

    const inCavasPanel = (setUI) => {
        return (
            <div>
                <div className='buttonPanel'>
                    <div className='buttonLeftGroup'>
                        <CameraOutlined className='downloadIcon'></CameraOutlined>
                        <Button onClick={() => setUI(0)}>Point Cloud</Button>
                        <Button onClick={() => setUI(1)}>Network</Button>
                    </div>
                    <div className='buttonRightgroup'>
                        <Button>Reset</Button>
                    </div>
                </div>

                <div className='zoomPanel'>
                    <PlusSquareFilled />
                    <MinusSquareFilled />
                </div>
            </div>
        )
    }

    // TODO optimize
    useEffect(() => {
        if (node !== null && camera.current && controls.current && nodePool.current[node]) {
            // use for region highlight; disable camera update
            is3D && updateCamera(camera.current, controls.current, nodePool.current[node]);

        }

        // potential bug
        // if (node !== null && camera2D.current && controls2D.current && nodePool2D.current[node]) {
        //     !is3D && updateCamera(camera2D.current, controls2D.current, nodePool2D.current[node]);
        // }
    }, [node]);

    useEffect(() => {
        const currPool = is3D ? nodePool.current : nodePool2D.current;
        for (let node of prevHighlight) {
            restoreHighlight(currPool[node]);
        }

        setPrevHighlight(new Set(regionSelectNodes));
                    
        for (let hightNode of regionSelectNodes) {
            highlightNode(currPool[hightNode]);
        }

    }, [regionSelectNodes]);


    return (
        <div className='pointCloud'>
            <Panel is3D={is3D} setIs3D={setIs3D} width={window.innerWidth * style.widthRatio}></Panel>
            <div style={{position: 'relative'}}>
                <div ref={canvas2DRef} style={{
                    width: window.innerWidth * style.widthRatio,
                    height: window.innerHeight * style.heightRatio,
                    display: is3D ? 'none' : 'block',
                }}>
                    {inCavasPanel(setUI)}
                </div>

                <div ref={canvasRef} style={{
                    width: window.innerWidth * style.widthRatio,
                    height: window.innerHeight * style.heightRatio,
                    display: is3D ? 'block' : 'none',
                }}>
                    {inCavasPanel(setUI)}
                </div>
            </div>
            
        </div>
    )
}
export default PointCloud;
