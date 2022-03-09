import React, { Component } from 'react';
import PointCloud from './componmnet/PointCloud/PointCloud';

function App() {
    const [layout, setLayout] = React.useState(0);
    return (
        <div>
            <div>
                <button onClick={() => setLayout(1)}> Sphere </button>
                <button onClick={() => setLayout(0)}> KK </button>
            </div>
            <PointCloud  layout={layout} />
        </div>
    )
}

export default App;