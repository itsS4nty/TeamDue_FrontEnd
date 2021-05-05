import React, {useState} from 'react';
import { AddFile } from './components/AddFile';
import FileGrid from './components/FileGrid';

const PremiumPage = () => {
    const [file, setFile] = useState(['Archivo']);

    return (
        <>
           <h1>Tus archivos</h1>
           <div id='createFile'>
               <p>Crear archivo</p>
                <AddFile setFiles={setFile} />
           </div>
           {file.map(fil => <FileGrid key={fil.name} file={fil.name} />)}
        </>
    );
        
} 

export default PremiumPage;