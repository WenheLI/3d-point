import React, { Component, useEffect, useRef, useState } from 'react';
import cgl from '../../lib/clustergrammer-gl.node';
import data from '../../../data/cytof.json';

function HeatMap({setNode, style, selectedNode}) {
    const containerRef = useRef(null);
    const cg = useRef(null);

    useEffect(() => {
        if (containerRef.current !== null) {
            const args = {
                'container': containerRef.current,
                'network': data,
                'viz_width' : style.width,
                'viz_height': style.height,
                'hide_panels': false,
                'onclick': function(row, col) {
                    setNode(col);
                }
            }
            cg.current = new cgl(args);

        }
          
    }, [containerRef]);

    useEffect(() => {
        console.log(selectedNode)
        if (cg.current !== null && selectedNode !== null) {
            cg.current.utils.highlight(selectedNode);
        }
    }, [selectedNode]);
    
    return (
        <div id='HeatMap-Container' ref={containerRef}>

        </div>
    )
}
export default HeatMap;