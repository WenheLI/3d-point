import React, { useEffect, useState } from 'react';
import './Panel.css';
import { DownOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, AutoComplete} from 'antd';

const mockVal = (str, repeat) => ({
    value: str.repeat(repeat),
  });

function Panel({cgm}) {
    const [tab, setTab] = useState(0);
    const [options, setOptions] = useState([]);
    const [orderData, setOrderData] = useState({
        'reorder': {'row': 0, 'col': 0},
        'recluster': {'dist': 0, 'link': 0},
    });
    
    const tabDesc = {
        'reorder': ['Row', 'Col'],
        'recluster': ['Dist', 'Link'],
    }
    const tabOptions = ['reorder', 'recluster'];
    const orderOptions = ['clust', 'sum', 'var', 'ini'];
    const reclusterOptions = {
        'dist': ['', 'cosine', 'euclidean', 'correlation'],
        'link': ['', 'complete', 'average', 'single'],
    };

    const orderItems = orderOptions.map((order, idx) => {
        return {
            label: <span>{order}</span>,
            key: idx
        }
    });

    const reclusterItems = {
        'dist': reclusterOptions['dist'].map((dist, idx) => {
            return {
                label: <span>{dist}</span>,
                key: idx
            }
        }),
        'link': reclusterOptions['link'].map((link, idx) => {
            return {
                label: <span>{link}</span>,
                key: idx
            }
        })
    };


    const onSearch = (searchText) => {
        setOptions(
            !searchText ? [] : [mockVal(searchText, 1), mockVal(searchText, 2), mockVal(searchText, 3)],
        );
        };
    const onSelect = (data) => {
        console.log('onSelect', data);
    };

    useEffect(() => {
        if (!cgm.current) return ;
        if (tab === 0) {
            const rowValue = orderData['reorder']['row'];
            const colValue = orderData['reorder']['col'];
            cgm.current.functions.reorder('row', orderOptions[rowValue]);
            cgm.current.functions.reorder('col', orderOptions[colValue]);
        } else if (tab === 1) {
            const disValue = reclusterOptions.dist[orderData['recluster']['dist']];
            const linkValue = reclusterOptions.link[orderData['recluster']['link']];
            console.log(disValue, linkValue);
            cgm.current.functions.recluster(disValue, linkValue);
        }
    }, [orderData]);
    


    const buildMenu = (axis) => {
        let items = undefined
        if (axis == 'row' || axis == 'col') items = orderItems;
        else items = reclusterItems[axis];
        return (
            <Menu
                onClick={(e) => {
                    const tabName = tabOptions[tab];
                    setOrderData({
                        ...orderData,
                        [tabName]: {
                            ...orderData[tabName],
                            [axis]: e.key,
                        }
                    });
                }}
                items={items}
            />
        )
    }
            
      
    
    return (<div className='panel'>
            <div className='leftPanel'>
                <div className='switchPanel'>
                    <Button type='text'></Button>
                    <div id='dropdownLabel' className='dropdownPanel'>
                        {tabDesc[tabOptions[tab]].map((desc, idx) => 
                            <span key={idx}>{desc}</span>
                        )}
                    </div>
                </div>
                <div className='switchPanel'>
                    <Button className={tab == 0 ? 'selected' : ''}
                            onClick={() => setTab(0)}
                            type='text'>Reorder</Button>
                    <div className='dropdownPanel'>
                        {
                            tab == 0 ? (
                                <>
                                <Dropdown overlay={buildMenu('row')} trigger={['click']}>
                                    <Button>
                                        {orderOptions[orderData.reorder.row]} <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Dropdown overlay={buildMenu('col')} trigger={['click']}>
                                    <Button>
                                        {orderOptions[orderData.reorder.col]} <DownOutlined />
                                    </Button>
                                </Dropdown>
                                </>
                            ) : <></>
                        }
                    </div>
                </div>
                <div className='switchPanel'>
                    <Button className={tab == 1 ? 'selected' : ''} 
                            onClick={() => setTab(1)}
                            type='text'>Recluster</Button>
                    <div className='dropdownPanel'>
                        {
                            tab == 1 ? (
                                <>
                                <Dropdown overlay={buildMenu('dist')} trigger={['click']}>
                                    <Button>
                                        {reclusterOptions.dist[orderData.recluster.dist]} <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Dropdown overlay={buildMenu('link')} trigger={['click']}>
                                    <Button>
                                        {reclusterOptions.link[orderData.recluster.link]} <DownOutlined />
                                    </Button>
                                </Dropdown>
                                </>
                            ) : <></>
                        }
                    </div>
                </div>
            </div>

            <div className='rightPanel'>
                <div className='searchPanel'>
                    <span>Search Gene</span>
                    <AutoComplete
                        options={options}
                        style={{ width: 100, marginLeft: '10px' }}
                        onSelect={onSelect}
                        onSearch={onSearch}
                        placeholder="input here"
                    />
                    <Button>Search</Button>
                </div>
        </div>
        
    </div>)
}

export default Panel;