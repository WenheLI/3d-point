import React, { Component, useEffect, useRef } from 'react';
import { main } from './render';
import oriData from '../../../data/data.json';
import { preprocess } from '../../utils';

const updateLayout = (spheres, graph) => {
    for (const id in spheres) {
        const sphere = spheres[id];
        const pos = graph.queryPoint(id, 3);
        sphere.position.x = pos[0] * 10;
        sphere.position.y = pos[1] * 10;
        sphere.position.z = pos[2] * 10;
        for (const [line, sphere_] of sphere.userData.lineAsSource) {
            line.geometry.setFromPoints([sphere_.position, sphere.position]);
        }
        for (const [line, sphere_] of sphere.userData.lineAsTarget) {
            line.geometry.setFromPoints([sphere.position, sphere_.position]);
        }
    }
}

function PointCloud({ layout }) {
    const canvasRef = useRef(null);
    const shperes = useRef(null);
    const graph = useRef(null);
    console.log(layout)
    useEffect(async () => {
        if (canvasRef.current !== null) {
            let data = preprocess(oriData);
            const [spheres, graph_] = await main(canvasRef.current, data);
            shperes.current = spheres;
            graph.current = graph_;
        }
    }, [canvasRef]);

    useEffect(() => {
        if (shperes.current !== null) {
            if (layout === 0) {
                graph.current.kamadaKawai3DLayout(200, .5, 12);
            } else if (layout === 1) {
                graph.current.sphereLayout();
            }
            updateLayout(shperes.current, graph.current);
        }
    }, [layout]);
    
    return (
        <div ref={canvasRef} style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
        }}></div>
    )
}
export default PointCloud;