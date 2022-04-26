import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateCamera } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';
import './PointCloud.css';
import Panel from './Panel';
import { Button } from 'antd';
import { CameraOutlined, PlusSquareFilled, MinusSquareFilled } from '@ant-design/icons';


function PointCloud({ node, style, setNode }) {
    const canvasRef = useRef(null);
    const camera = useRef(null);
    const controls = useRef(null);
    const nodePool = useRef(null);

    const [scene, setScene] = useState(0);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
                main(canvasRef.current, oriData, style.canvasRatio, style.backgroundColor, setNode);
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
        <div className='pointCloud'>
            <Panel scene={scene}></Panel>
            <div ref={canvasRef} style={{
                width: window.innerWidth * style.canvasRatio,
                height: window.innerHeight * style.canvasRatio
            }}>
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
        </div>

    )
}
export default PointCloud;
