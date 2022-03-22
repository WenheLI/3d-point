import React, { Component, useEffect, useRef, useState } from 'react';
import { main } from './render';
import oriData from '../../../data/pca_3dumap_outputs_with_metadata.json';


function PointCloud({ layout }) {

    const canvasRef = useRef(null);

    useEffect(async () => {
        if (canvasRef.current !== null) {
            main(canvasRef.current, oriData, .45);
        }
    }, [canvasRef]);

    return (
        <div ref={canvasRef} style={{
            width: '45%',
            height: '45%',
            left: '50%',
            position: 'absolute',
        }}></div>
    )
}
export default PointCloud;