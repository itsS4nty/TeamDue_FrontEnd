import React, {useState} from 'react';
import { AddFile } from './components/AddFile';
import FileGrid from './components/FileGrid';
import {cookies} from './helpers/createCookies';

const PremiumPage = (props) => {
    const [file, setFile] = useState(['Archivo']);
    if(!cookies.get('loggedIn')) props.history.push('/login');

    return (
        <div id="principal-container">
           <h1>Tus archivos</h1>
           <div id='createFile'>
               <p>Crear archivo</p>
                <AddFile setFiles={setFile} />
           </div>
           {file.map(fil => <FileGrid key={fil.name} file={fil.name} />)}
        </div>
    );
        
} 

export default PremiumPage;