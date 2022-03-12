import React, { Component } from 'react';
import PointCloud from './componmnet/PointCloud/PointCloud';

function App() {
    const [layout, setLayout] = React.useState(0);
    return (
        <div>
            <div>
                <button onClick={() => setLayout(0)}> KK </button>
                <button onClick={() => setLayout(1)}> Sphere </button>
                <button onClick={() => setLayout(2)}> Random </button>
                <button onClick={() => setLayout(3)}> Grid </button>
                <button onClick={() => setLayout(4)}> FR </button>
                <button onClick={() => setLayout(5)}> Drl </button>
            </div>
            <PointCloud  layout={layout} />
        </div>
    )

    // random3DLayout
    // gridLayout
    // fruchtermanReingold3DLayout
    // drl3DLayout
}

export default App;