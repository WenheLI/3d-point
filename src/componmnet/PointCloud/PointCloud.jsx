import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera, restoreHighlight, highlightNode } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';
import data2D from '../../../data/pca_umap_outputs_with_metadata_Edgar.json';
import './PointCloud.css';
import Panel from './Panel';
import { Button } from 'antd';
import { CameraOutlined, PlusSquareFilled, MinusSquareFilled } from '@ant-design/icons';


function PointCloud({ node, style, setNode }) {
    const canvasRef = useRef(null);
    const canvas2DRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);
    const nodePool = useRef(null);
    const camera2D = useRef(null);
    const controls2D = useRef(null);
    const nodePool2D = useRef(null);
    const [display, setDisplay] = useState('');
    const [display2D, setDisplay2D] = useState('');
    const [buttonLabel, setLabel] = useState('2D');

    const [canvas, setCanvas] = useState(canvasRef);

    const hightNodes = new Set();
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

    useEffect(() => {
        if (node !== null && camera.current && controls.current && nodePool.current[node]) {
            // use for region highlight; disable camera update
            updateCamera(camera.current, controls.current, nodePool.current[node]);
            if (hightNodes.has(node)) {
                hightNodes.delete(node);
                restoreHighlight(nodePool.current[node]);
            } else {
                hightNodes.add(node);
            }
            for (let hightNode of hightNodes) {
                highlightNode(nodePool.current[hightNode]);
            }
        }
        if (node !== null && camera2D.current && controls2D.current && nodePool2D.current[node]) {
            updateCamera(camera2D.current, controls2D.current, nodePool2D.current[node]);
        }
    }, [node])

    const inCavasPanel = () => {
        return (
            <div>
                <div className='buttonPanel'>
                    <div className='buttonLeftGroup'>
                        <CameraOutlined className='downloadIcon'></CameraOutlined>
                        <Button>Point Cloud</Button>
                        <Button>Network</Button>
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
    return (
        <div className='pointCloud'>
            <Panel display={display} setDisplay={setDisplay} setDisplay2D={setDisplay2D} 
                buttonLabel={buttonLabel} setLabel={setLabel} width={window.innerWidth * style.widthRatio}></Panel>
            <div style={{position: 'relative'}}>
                <div ref={canvas2DRef} style={{
                    position: 'absolute',
                    width: window.innerWidth * style.widthRatio,
                    height: window.innerHeight * style.heightRatio,
                    display: display2D,
                }}>
                    {inCavasPanel()}
                </div>

                <div ref={canvasRef} style={{
                    position: 'absolute',
                    width: window.innerWidth * style.widthRatio,
                    height: window.innerHeight * style.heightRatio,
                    display: display,
                }}>
                    {inCavasPanel()}
                </div>
            </div>
            
        </div>
    )
}
export default PointCloud;
