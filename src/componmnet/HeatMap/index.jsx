import React, { Component, useEffect, useRef, useState } from 'react';
import cgl from '../../lib/clustergrammer-gl.node';
import data from '../../../data/cytof.json';
import Panel from './Panel';
import 'antd/dist/antd.css';
import { CameraOutlined } from '@ant-design/icons'
import './index.css'

function HeatMap({setNode, style, selectedNode}) {
    const containerRef = useRef(null);
    const [cg, setCg] = useState(null);

    useEffect(() => {
        if (containerRef.current !== null) {
            const args = {
                'container': containerRef.current,
                'network': data,
                'viz_width' : style.width,
                'viz_height': style.height,
                'hide': true,
                'onclick': function(row, col) {
                    setNode(col);
                }
            }
            const cg = new cgl(args);
            setCg(cg)

        }
          
    }, [containerRef]);

    useEffect(() => {
        if (cg !== null && selectedNode !== null) {
            cg.utils.highlight(selectedNode);
        }
    }, [selectedNode]);

    const handleDownload = () => {
        if (!cg) return;
        const canvas = cg.args.container.querySelector('canvas');
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'heatmap.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    return (
        <div className='heatmap'>
            <Panel cgm={cg} />
            <div id='HeatMap-Container' ref={containerRef}
                    style={{
                        marginTop: '20px',
                        marginLeft: '20px', 
                        width: style.width,
                        height: style.height,
                    }}
            >
                <CameraOutlined onClick={handleDownload} className='downloadIcon' />

            </div>
        </div>
    )
}
export default HeatMap;
