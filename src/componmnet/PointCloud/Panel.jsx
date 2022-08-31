import React from 'react'
import './Panel.css'
import { AutoComplete, Slider, Input } from 'antd'

function Panel ({
  display, is3D, setIs3D, setLegendDisplay, width
}) {
  return (
    <div className="panel panel-3d" style={{ width }}>
      <div className="panel-head-3d">
        <h1>Network</h1>

        <a onClick={() => {
          setLegendDisplay(false)
          setIs3D((prev) => !prev)
        }}
        >
          Switch to
          {' '}
          {!is3D ? '3D' : '2D'}
        </a>
      </div>
      <div className="panel-body-3d">
        <div className="slider-panel">
          <span>Max Fold</span>
          <Slider className="slider" min={-3} max={0} step={0.1} />
        </div>
        <div className="slider-panel">
          <span>Min Fold</span>
          <Slider className="slider" min={0} max={3} step={0.1} />
        </div>
        <div className="query-panel">
          <span>Node Query</span>
          <AutoComplete
            placeholder="input here"
            className="query-input"
            style={{ width: '20%' }}
          >
            <Input
                  style={{
                    width: '100%'
                  }}
                  size="small"
                />
          </AutoComplete>
        </div>
      </div>
    </div>

  )
}

export default Panel
