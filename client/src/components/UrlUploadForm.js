import React, { useState } from 'react'
import axios from 'axios';
import styles from '../style/UrlUploadForm.module.css'

const UrlUploadForm = (props) => {

    const [inputUrl, setInPutUrl]= useState('paste your URL here')

    const handleOnChangeUrlInput = (e) => {
        setInPutUrl(e.target.value)
        
    }
   
    const onSubmit = async e => {
        e.preventDefault();
        
        try {
          const res = await axios.post('http://localhost:8080/', 
          {url: inputUrl}, 
          { headers: { 'Content-Type': 'application/json'} },
        );
        const paramArr = res.data.fileName.split('/')
        const src =  paramArr.slice(paramArr.length-2).join('/')
        
        props.updateImageSrc(src);
        props.openMain();
            
        } catch (err) {
         console.log(err)
        }
    }

    return (
      <div className= {styles.LoginContainer}>
        <form onSubmit ={onSubmit} className ={styles.LoginForm}>
          Paste an URL
                <input
                value ={inputUrl}
                type="text" 
                onChange = {handleOnChangeUrlInput}
                placeholder = 'Paste an Url'
                />
                <input
                  type='submit'
                  value='Upload'
                />   
        </form>
    </div>
    )
}

export default UrlUploadForm