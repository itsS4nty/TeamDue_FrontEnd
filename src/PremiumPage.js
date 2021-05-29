import React, {useState} from 'react';
import axios from 'axios';
import { AddFile } from './components/AddFile';
import FileGrid from './components/FileGrid';
import {cookies} from './helpers/createCookies';
import { socket } from './helpers/createSocket';

const PremiumPage = (props) => {
    const [file, setFile] = useState(['Archivo']);
    if(!cookies.get('loggedIn')) props.history.push('/login');
    const redirect = (route, fileId, hash, fileName, admin) => {
        if(route === 'board') {
            socket.emit("new-room", {
                roomId: hash,
                usuario: cookies.get('username')
            });
            props.history.push({pathname: `/${route}`, search: `?roomId=${hash}&fileId=${fileId}&fileName=${fileName.split('.')[0]}&button=${true}`});
        } else {
            axios.get(`http://51.38.225.18:3000/pedirTexto?usuario=${cookies.get('username')}&nombre=${fileName.split('.')[0]}`).then((response) => {
                let content = JSON.stringify(response.data).replace(/(")/g, "");
                console.log(typeof response.data);
                sessionStorage.setItem('content', response.data);
                props.history.push({pathname: `/${route}`, search: `?roomId=${hash}&fileId=${fileId}&fileName=${fileName.split('.')[0]}`});
            })
        }
    }
    return (
        <div id="principal-container">
           <h1>Tus archivos</h1>
           <div id='createFile'>
               <p>Crear archivo</p>
                <AddFile setFiles={setFile} redirect={redirect} />
           </div>
           {file.map(fil => <FileGrid key={fil.name} file={fil.name} redirect={redirect} />)}
        </div>
    );
        
} 

export default PremiumPage;