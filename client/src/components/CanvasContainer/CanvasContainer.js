import React from 'react'
import './CanvasContainer.css'
const CanvasContainer = (props) => {
    return (
        <div className = 'col-sm col-md-9 CanvasContainer'>    
            {props.children}    
        </div>
    )
}

export default CanvasContainer
