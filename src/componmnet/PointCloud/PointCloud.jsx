import React, { Component, useEffect, useRef, useState } from 'react';
import { generateGredientColor, generateCategoryColor, generateRandomColor } from '../../utils/index';
import { main, updateCamera, restoreHighlight, highlightNode } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';
import data2D from '../../../data/pca_umap_outputs_with_metadata_Edgar.json';
import colorData from '../../../data/processed_data.json';
import './PointCloud.css';
import Panel from './Panel';
import { CameraOutlined, PlusSquareFilled, MinusSquareFilled } from '@ant-design/icons';
import Rainbow from 'rainbowvis.js'
import { Button } from 'antd';

function PointCloud({ node, style, setNode, regionSelectNodes, setUI }) {
    const ref3D = {
        canvasRef: useRef(null),
        camera: useRef(null),
        controls: useRef(null),
        nodePool: useRef(null),
    }
    const ref2D = {
        canvasRef: useRef(null),
        camera: useRef(null),
        controls: useRef(null),
        nodePool: useRef(null),
    }

    const [legend, setLegend] = useState([]);
    const [legendDisplay, setLegendDisplay] = useState(true);

    const [is3D, setIs3D] = useState(true);
    const [prevHighlight, setPrevHighlight] = useState(new Set());

    const myRainbow = new Rainbow();
    myRainbow.setNumberRange(0, 1);
    myRainbow.setSpectrum('#FE0002', '#0302FC');

    const renderCanvas = (ref, data, stateCam, stateControl, stateNodePool, is3D, colorRand) => {
        if (ref.current !== null) {
            const {camera: localCam, controls: localControl, nodePool: localNodePool} = 
                main(ref.current, data, style.canvasRatio, 
                        style.backgroundColor, setNode, is3D, colorRand);
            stateCam.current = localCam;
            stateControl.current = localControl;
            stateNodePool.current = localNodePool;
        }
    }

    useEffect(() => {
        renderCanvas(ref3D.canvasRef, oriData, ref3D.camera, ref3D.controls, ref3D.nodePool, true, true);
    }, [ref3D.canvasRef]);

    useEffect(() => {
        renderCanvas(ref2D.canvasRef, data2D, ref2D.camera, ref2D.controls, ref2D.nodePool, false, true);

    }, [ref2D.canvasRef]);

    useEffect(() => {
        if (node !== null && ref3D.camera.current && ref3D.controls.current && ref3D.nodePool.current[node]) {
            updateCamera(ref3D.camera.current, ref3D.controls.current, ref3D.nodePool.current[node]);
        }
        if (node !== null && ref2D.camera.current && ref2D.controls.current && ref2D.nodePool.current[node]) {
            updateCamera(ref2D.camera.current, ref2D.controls.current, ref2D.nodePool.current[node]);
        }
    }, [node]);

    useEffect(() => {
        const currPool = is3D ? ref3D.nodePool.current : ref2D.nodePool.current;
        for (let node of prevHighlight) {
            restoreHighlight(currPool[node]);
        }

        setPrevHighlight(new Set(regionSelectNodes));
                    
        for (let hightNode of regionSelectNodes) {
            highlightNode(currPool[hightNode]);
        }

    }, [regionSelectNodes]);

    const gradientColor = () => {
        setLegendDisplay(false);
        const pool = is3D ? ref3D.nodePool.current : ref2D.nodePool.current;
        generateGredientColor(colorData, pool, myRainbow);
    }

    const categoryColor = () => {
        setLegendDisplay(true);
        const newDivs = [];
        const pool = is3D ? ref3D.nodePool.current : ref2D.nodePool.current;
        const colorPool = generateCategoryColor(colorData, pool);
        for (const [key, value] of Object.entries(colorData.cat_mapper)) {
            const colorStr = colorPool[key].substr(2);
            const r = parseInt(colorStr.substr(0, 2), 16);
            const g = parseInt(colorStr.substr(2, 2), 16);
            const b = parseInt(colorStr.substr(4, 2), 16);

            newDivs.push(
                <div key={value} style={{margin: 0, display: "flex", 
                                        flexDirection: "row", justifyContent:'flex-end'}}>
                    <div style={{backgroundColor: `rgb(${r}, ${g}, ${b})`, width: '15px', height: '15px'}}></div>
                    <p style={{paddingLeft: '10px'}}>{value}</p>
                </div>
            );
        }
        setLegend(newDivs);
    }

    const resetColor = () => {
        setLegendDisplay(false);
        const pool = is3D ? ref3D.nodePool.current : ref2D.nodePool.current;
        generateRandomColor(pool);  
    }

    const inCavasPanel = (setUI) => (
        <div>
            <div className='buttonPanel'>
                <div className='buttonLeftGroup'>
                    <CameraOutlined className='downloadIcon'></CameraOutlined>
                    <Button onClick={() => setUI(0)}>Point Cloud</Button>
                    <Button onClick={() => setUI(1)}>Network</Button>
                </div>
                <div className='buttonRightgroup'>
                    <Button onClick={gradientColor}>Color Gradient</Button>
                    <Button onClick={categoryColor}>Color Group</Button>
                    <Button onClick={resetColor}>Reset</Button>
                    <div style={{paddingTop: '20px', display: "flex", 
                                flexDirection: "column", alignItem: 'flex-end', 
                                display: legendDisplay ? '' : 'none'}}>
                        {legend}
                    </div>
                    
                </div>
            </div>

            <div className='zoomPanel'>
                <PlusSquareFilled />
                <MinusSquareFilled />
            </div>
        </div>
    )

    return (
        <div className='pointCloud'>
            <Panel  is3D={is3D} setIs3D={setIs3D}
                    setLegendDisplay={setLegendDisplay} 
                    width={window.innerWidth * style.widthRatio}>    
            </Panel>
            <div style={{position: 'relative'}}>
                {/* the map way is working but it did not seem to shorten the code and added confusion */}
                {
                    [ref2D, ref3D].map(it => {
                        let key = 0;
                        let display = '';
                        if (it === ref2D) {
                            display = is3D ? 'none' : 'block';
                        } else {
                            display = is3D ? 'block' : 'none';
                            key = 1;
                        }
                        return (
                            <div key={key} ref={it.canvasRef} style={{
                                position: 'absolute',
                                width: window.innerWidth * style.widthRatio,
                                height: window.innerHeight * style.heightRatio,
                                display: display,
                            }}>
                                {inCavasPanel(setUI)}
                            </div>
                        )
                    })
                } 
                {/* <div ref={ref2D.canvasRef} style={{
                    position: 'absolute',
                    width: window.innerWidth * style.widthRatio,
                    height: window.innerHeight * style.heightRatio,
                    display: is3D ? 'none' : 'block',
                }}>
                    {inCavasPanel(setUI)}
                </div>

                <div ref={ref3D.canvasRef} style={{
                    width: window.innerWidth * style.widthRatio,
                    height: window.innerHeight * style.heightRatio,
                    display: is3D ? 'block' : 'none',
                }}>
                    {inCavasPanel(setUI)}
                </div> */}
            </div>
            
        </div>
    )
}
export default PointCloud;
