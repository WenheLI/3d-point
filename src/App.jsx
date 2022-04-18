import React, { Component } from 'react';
import Network from './componmnet/Network/Network';
import HeatMap from './componmnet/HeatMap/index';
import PointCloud from './componmnet/PointCloud/PointCloud';
import Tooltip from './componmnet/Tooltip/Tooltip';

function App() {
    const [layout, setLayout] = React.useState(0);
    const [node, setNode] = React.useState(null);

    const heatMapStyle = {width: 650, height: 500};
    const cloudStyle = {width: '45%', height: '45%', 
                        canvasRatio: .6, backgroundColor: 0xffffff};

    return (
        <div>
            <Tooltip />
            <div style={{display: "flex"}}>
                {/* <div>
                    <button onClick={() => setLayout(0)}> KK </button>
                    <button onClick={() => setLayout(1)}> Sphere </button>
                    <button onClick={() => setLayout(2)}> Random </button>
                    <button onClick={() => setLayout(3)}> Grid </button>
                    <button onClick={() => setLayout(4)}> FR </button>
                    <button onClick={() => setLayout(5)}> Drl </button>
                </div>
                <Network  layout={layout} /> */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h1>Heat Map</h1>
                    <HeatMap setNode={setNode} heatMapStyle={heatMapStyle}/>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h1>3D Visualization</h1>
                    <PointCloud node={node} cloudStyle={cloudStyle}/>
                </div>
            </div>
        </div>
    )
}

export default App;
