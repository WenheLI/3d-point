import React, { Component, useEffect, useRef, useState } from 'react';
import { main, updateLayout } from './render';
import oriData from '../../../data/data.json';
import { preprocess } from '../../utils';
import { Graph } from 'igraph-wasm';


function Network({ layout }) {
    const [graph, setGraph] = useState(null);

    useEffect(async () => {
        const g = new Graph();
        await g.init();
        const graph = g.createInstance();
        setGraph(graph);
    }, []);

    const canvasRef = useRef(null);
    const shperes = useRef(null);
    useEffect(() => {
        if (canvasRef.current !== null && graph) {
            let data = preprocess(oriData);
            const spheres = main(canvasRef.current, data, graph);
            shperes.current = spheres;
        }
    }, [canvasRef, graph]);

    useEffect(() => {
        if (shperes.current !== null && graph) {
            if (layout === 0) {
                graph.kamadaKawai3DLayout(200, .5, 12);
            } else if (layout === 1) {
                graph.sphereLayout();
            } else if (layout === 2) {
                graph.random3DLayout();
            } else if (layout === 3) {
                graph.gridLayout();
            } else if (layout === 4) {
                graph.fruchtermanReingold3DLayout();
            } else if (layout === 5) {
                graph.drl3DLayout();
            }
            updateLayout(shperes.current, graph);
        }
    }, [layout, graph]);
    
    return (
        <div ref={canvasRef} style={{
        }}></div>
    )
}
export default Network;