import React, { useEffect, useState } from 'react';
import './Panel.css';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, AutoComplete, Slider, Input} from 'antd';

function Panel({display, setDisplay, setDisplay2D, setLegendDisplay, buttonLabel, setLabel, width}) {

    return (
        <div className='panel panel-3d'  style={{width: width}}>
            <div className='panel-head-3d'>
                <h1>Network</h1>

                <a onClick={() => {
                    setLegendDisplay('none')
                    if (display === '') {
                        setDisplay('none');
                        setDisplay2D('');
                        setLabel('3D');
                    } else {
                        setDisplay('');
                        setDisplay2D('none');
                        setLabel('2D');
                    }
                }}> 
                Switch to {buttonLabel}</a>
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