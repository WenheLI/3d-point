import React, { useEffect, useState } from 'react';
import './Panel.css';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, AutoComplete, Slider, Input} from 'antd';

function Panel({scene}) {

    return (
        <div className='panel panel-3d'>
            <div className='panel-head-3d'>
                <h1>Netowrk</h1>

                <a>Switch to {scene === 0  ? '2D' : '3D' }</a>
            </div>
            <div className='panel-body-3d'>
                <div className='slider-panel'>
                    <span>Max Fold</span>
                    <Slider className='slider' min={-3} max={0} step={0.1}></Slider>
                </div>
                <div className='slider-panel'>
                    <span>Min Fold</span>
                    <Slider className='slider' min={0} max={3} step={0.1}></Slider>
                </div>
                <div className='query-panel'>
                    <span>Node Query</span>
                    <AutoComplete
                        placeholder="input here"
                        className='query-input'
                        style={{'width': '20%'}}
                        children={<Input style={{
                            width: '100%',
                        }} size='small'></Input>}
                    ></AutoComplete>
                </div>
            </div>
        </div>
        
    )
}

export default Panel;