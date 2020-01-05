import React from 'react'

const MainContent = (props) => {
    return (
        <div className = 'col-sm col-md-9 MainContent'>    
            {props.children}    
        </div>
    )
}

export default MainContent
