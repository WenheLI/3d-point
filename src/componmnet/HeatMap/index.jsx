import React, { Component, useEffect, useRef, useState } from 'react';
import cgl from '../../lib/clustergrammer-gl.node';
import data from '../../../data/cytof.json';

function HeatMap() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current !== null) {
            const args = {
                'container': containerRef.current,
                'network': data,
                'viz_width' :600,
                'viz_height': 500,
                'onclick': function(rol, col) {
                    console.log(rol, col);
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