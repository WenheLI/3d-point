import React, { Component, useEffect, useRef, useState } from 'react';
import cgl from '../../lib/clustergrammer-gl.node';
import data from '../../../data/cytof.json';
import Panel from './Panel';
import 'antd/dist/antd.css';

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
    
    return (
        <>
        <Panel cgm={cg} />
        <div id='HeatMap-Container' ref={containerRef}
                style={{
                    marginTop: '20px',
                    width: style.width,
                    height: style.height,
                }}
        >

        </div>
        </>
    )
}
export default HeatMap;
