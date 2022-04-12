import React, { Component, useState } from 'react';
import Network from './componmnet/Network/Network';
import HeatMap from './componmnet/HeatMap/index';
import PointCloud from './componmnet/PointCloud/PointCloud';

function App() {
    const [layout, setLayout] = React.useState(0);
    const [node, setNode] = React.useState(null);

    const [selectNodes, setSelectionNodes] = useState([]);

    return (
        <div>
            {/* <div>
                <button onClick={() => setLayout(0)}> KK </button>
                <button onClick={() => setLayout(1)}> Sphere </button>
                <button onClick={() => setLayout(2)}> Random </button>
                <button onClick={() => setLayout(3)}> Grid </button>
                <button onClick={() => setLayout(4)}> FR </button>
                <button onClick={() => setLayout(5)}> Drl </button>
            </div>
            <Network  layout={layout} /> */}
            <HeatMap setNode={setNode} selectedNode={selectNodes}/>
            <PointCloud node={node} setNode={setSelectionNodes}/>
        </div>
    )
}

export default App;
