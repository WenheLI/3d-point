import React, { useEffect, useState } from 'react'
import './Panel.css'
import { DownOutlined } from '@ant-design/icons'
import {
  Menu, Dropdown, Button, AutoComplete, Slider
} from 'antd'

const tabDesc = {
  reorder: ['Row', 'Col'],
  recluster: ['Dist', 'Link']
}
const tabOptions = ['reorder', 'recluster']
const orderOptions = ['clust', 'sum', 'var', 'ini']
const reclusterOptions = {
  dist: ['', 'cosine', 'euclidean', 'correlation'],
  link: ['', 'complete', 'average', 'single']
}

function Panel ({ cgm }) {
  const [tab, setTab] = useState(0)
  const [searchOptions, setSearchOptions] = useState([])
  const [orderData, setOrderData] = useState({
    reorder: { row: 0, col: 0 },
    recluster: { dist: 0, link: 0 }
  })
  const [searchContent, setSearchContent] = useState('')

  const orderItems = orderOptions.map((order, idx) => ({
    label: <span>{order}</span>,
    key: idx
  }))

  const reclusterItems = {
    dist: reclusterOptions.dist.map((dist, idx) => ({
      label: <span>{dist}</span>,
      key: idx
    })),
    link: reclusterOptions.link.map((link, idx) => ({
      label: <span>{link}</span>,
      key: idx
    }))
  }

  useEffect(() => {
    if (cgm) {
      const options = cgm.params.network.row_node_names.map((it) => ({
        value: it
      }))
      setSearchOptions(options)
    }
  }, [cgm])

  useEffect(() => {
    if (!cgm) return
    if (tab === 0) {
      const rowValue = orderData.reorder.row
      const colValue = orderData.reorder.col
      cgm.functions.reorder('row', orderOptions[rowValue])
      cgm.functions.reorder('col', orderOptions[colValue])
    } else if (tab === 1) {
      const disValue = reclusterOptions.dist[orderData.recluster.dist]
      const linkValue = reclusterOptions.link[orderData.recluster.link]
      cgm.functions.recluster(disValue, linkValue)
    }
  }, [orderData])

  const handleSearch = () => {
    if (!cgm) return
    cgm.utils.highlight(searchContent)
  }

  const buildMenu = (axis) => {
    let items
    if (axis === 'row' || axis === 'col') items = orderItems
    else items = reclusterItems[axis]
    return (
      <Menu
        onClick={(e) => {
          const tabName = tabOptions[tab]
          setOrderData({
            ...orderData,
            [tabName]: {
              ...orderData[tabName],
              [axis]: e.key
            }
          })
        }}
        items={items}
      />
    )
  }

  const handleOpacityChange = (value) => {
    if (!cgm) return
    cgm.adjust_opacity(1 - value + 0.01)
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h1>Heat Map</h1>
      </div>
      <div className="panel-body">
        <div className="leftPanel">
          <div className="switchPanel">
            <Button type="text" />
            <div id="dropdownLabel" className="dropdownPanel">
              {tabDesc[tabOptions[tab]].map((desc, idx) => <span key={idx}>{desc}</span>)}
            </div>
          </div>
          <div className="switchPanel">
            <Button
              className={tab === 0 ? 'selected' : ''}
              onClick={() => setTab(0)}
              type="text"
            >
              Reorder
            </Button>
            <div className="dropdownPanel">
              {
                                tab === 0
                                  ? (
                                  <>
                                    <Dropdown overlay={buildMenu('row')} trigger={['click']}>
                                      <Button>
                                        {orderOptions[orderData.reorder.row]}
                                        {' '}
                                        <DownOutlined />
                                      </Button>
                                    </Dropdown>
                                    <Dropdown overlay={buildMenu('col')} trigger={['click']}>
                                      <Button>
                                        {orderOptions[orderData.reorder.col]}
                                        {' '}
                                        <DownOutlined />
                                      </Button>
                                    </Dropdown>
                                  </>
                                    )
                                  : <></>
              }
            </div>
          </div>
          <div className="switchPanel">
            <Button
              className={tab === 1 ? 'selected' : ''}
              onClick={() => setTab(1)}
              type="text"
            >
              Recluster
            </Button>
            <div className="dropdownPanel">
              {
                                tab === 1
                                  ? (
                                  <>
                                    <Dropdown overlay={buildMenu('dist')} trigger={['click']}>
                                      <Button>
                                        {reclusterOptions.dist[orderData.recluster.dist]}
                                        {' '}
                                        <DownOutlined />
                                      </Button>
                                    </Dropdown>
                                    <Dropdown overlay={buildMenu('link')} trigger={['click']}>
                                      <Button>
                                        {reclusterOptions.link[orderData.recluster.link]}
                                        {' '}
                                        <DownOutlined />
                                      </Button>
                                    </Dropdown>
                                  </>
                                    )
                                  : <></>
              }
            </div>
          </div>
        </div>

        <div className="rightPanel">
          <div className="sliderPanel">
            <span>Opacity Slider</span>
            <Slider onChange={handleOpacityChange} className="opacitySlider" min={0} max={1} step={0.1} />
          </div>
          <div className="searchPanel">
            <span>Search Gene</span>
            <AutoComplete
              options={searchOptions}
              style={{ width: 100, marginLeft: '10px' }}
              filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              onSelect={setSearchContent}
              placeholder="input here"
            />
            <Button
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Panel
