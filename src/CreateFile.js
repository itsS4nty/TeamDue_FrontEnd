import React from 'react';
import PropTypes from 'prop-types';
// import React, { Fragment } from 'react';

const CreateFile = (fileNum = 0) => {

    return (
        <>
           <h1>Archivo</h1>
           <div id='createFile'>
               <p>{fileNum}</p>
           </div>
        </>
    );
        
} 

export default CreateFile;