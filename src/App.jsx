import React, { useState } from 'react'
import { Button } from 'antd'
import Network from './componmnet/Network/Network'
import HeatMap from './componmnet/HeatMap/index'
import PointCloud from './componmnet/PointCloud/PointCloud'
import Tooltip from './componmnet/Tooltip/Tooltip'
import { LAYOUTS } from './utils/constants'

function App () {
  const [layout, setLayout] = useState(0)
  const [node, setNode] = useState(null)

  // uiState == 0 PointCloud; uiState == 1 Network;
  const [uiState, setUIState] = useState(0)

  const [regionSelectNodes, setRegionSelectNodes] = useState(new Set())

  const [selectNodes, setSelectionNodes] = useState([])
  const heatMapStyle = { widthRatio: 0.5, heightRatio: 0.7 }
  const cloudStyle = {
    widthRatio: 0.45,
    heightRatio: 0.45,
    canvasRatio: 0.48,
    backgroundColor: 0xffffff
  }

  const buildPointCloud = (setUI) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>3D Visualization</h1>
      <PointCloud
        node={node}
        setNode={setSelectionNodes}
        regionSelectNodes={regionSelectNodes}
        style={cloudStyle}
        setUI={setUI}
      />
    </div>
  )

  const buildNetwork = (setUI) => (
    <div>
      <div>
        {Object.keys(LAYOUTS).map((key, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Button key={index} onClick={() => setLayout(LAYOUTS[key])}>{key}</Button>
        ))}
      </div>
      <Network setUI={setUI} layout={layout} />
    </div>
  )

  return (
    <div>
      <Tooltip />
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1>Heat Map</h1>
          <HeatMap
            setNode={setNode}
            selectedNode={selectNodes}
            regionSelectNodes={regionSelectNodes}
            setRegionSelectNodes={setRegionSelectNodes}
            style={heatMapStyle}
          />
        </div>
        <div>
          {
                        uiState === 0 ? buildPointCloud(setUIState) : buildNetwork(setUIState)
          }
        </div>
      </div>
    </div>
  )
}

export default App
