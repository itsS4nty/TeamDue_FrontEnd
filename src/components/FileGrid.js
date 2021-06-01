import React, { useEffect, useState } from 'react';
import { getFiles } from '../helpers/getFiles';
import { FileGridItem } from './FileGridItem';
import { AddFile } from './AddFile';

// import React, { Fragment } from 'react';

const FileGrid = ({file, redirect, setFile}) => {
    const [files, setFiles] = useState([]);
    useEffect( () => {
        getFiles().then(setFiles);
    }, [file]);
    return (
        <>
           <div id='allFiles'>
                <div id='createFile'>
                <p>Crear archivo</p>
                <AddFile setFiles={setFile} redirect={redirect} />
                </div>
                {
                    files.map(fil => <FileGridItem key={file} {...fil} redirect={redirect} />)
                }
           </div>
        </>
    );
        
} 

export default FileGrid;