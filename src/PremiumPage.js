import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import CreateFile from './CreateFile';

const PremiumPage = () => {
    const [fileNum, setFileNum] = useState(1);

    const addFile = () => {
       ReactDOM.render(<CreateFile/>, document.getElementById("createFile"));
    }

    return (
        <>
           <h1>Tus archivos</h1>
           <div id='createFile'>
               <p>Crear archivo</p>
                <button className="plus-button plus-button--large" onClick={addFile}></button>
           </div>
        </>
    );
        
} 

export default PremiumPage;