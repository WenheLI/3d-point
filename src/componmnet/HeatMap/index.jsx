import React, { Component, useEffect, useRef, useState } from 'react';
import cgl from '../../lib/clustergrammer-gl.node';
import data from '../../../data/cytof.json';

function HeatMap({setNode, style}) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current !== null) {
            const args = {
                'container': containerRef.current,
                'network': data,
                'viz_width' : style.width,
                'viz_height': style.height,
                'onclick': function(row, col) {
                    setNode(col);
                }
            }
            const cg = new cgl(args);
        }
          
    }, [containerRef])
    
    return (
        <div id='HeatMap-Container' ref={containerRef}>

        </div>
    )
}
export default HeatMap;