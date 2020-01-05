import React from 'react'

const SideBar = (props) => {
    return (
        <div className = 'col-sm col-md-3 sidebar'>
            {props.children}
        </div>
    )
}

export default SideBar
