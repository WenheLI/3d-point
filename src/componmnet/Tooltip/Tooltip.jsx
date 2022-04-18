import React, { Component, useEffect, useRef, useState } from 'react';


function Tooltip() {
    const [tip, setTip] = useState({x: 0, y: 0, label: ""});
    useEffect(() => {
        document.addEventListener('clientHovIn', event => {
            const detail = event.detail;
            let newTip = {x: detail.x, y: detail.y, label: detail.label};
            setTip(newTip);
        });

        document.addEventListener('clientHovOut', event => {
            setTip({
                ...tip,
                label: ''
            });
        });
    }, []);


    return (
        <div style={{display: "inline-blcok", 
                     backgroundColor: "black",
                     position: "absolute",
                     left: tip.x,
                     top: tip.y,
                     zIndex: 1000}}>
            <p style={{color: "white", margin: 0, padding: 0, wordWrap: "break-word"}}>{tip.label}</p>
        </div>
    )
}
export default Tooltip;
