import React, { useEffect, useState } from 'react';
import { getFiles } from '../helpers/getFiles';
import { FileGridItem } from './FileGridItem';

// import React, { Fragment } from 'react';

const FileGrid = ({file}) => {
    const [files, setFiles] = useState([]);
    // useEffect( () => {
    //     getFiles().then(setFiles);
    // }, [file]);
    return (
        <>
           <div id='createFile'>
                {
                    files.map(fil => <FileGridItem key={file} {...fil}/>)
                }
           </div>
        </>
    );
        
} 

export default FileGrid;