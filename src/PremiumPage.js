import React, {useEffect, useState} from 'react';
import axios from 'axios';
import FileGrid from './components/FileGrid';
import {cookies} from './helpers/createCookies';
import { socket } from './helpers/createSocket';

const PremiumPage = (props) => {
    const [file, setFile] = useState(['Archivo']);
    useEffect(() => {
        socket.connect();
    })
    if(!cookies.get('loggedIn')) props.history.push('/login');
    const redirect = (route, fileId, hash, fileName, admin) => {
        socket.emit("new-room", {
            roomId: hash,
            usuario: cookies.get('username')
        });
        if(route === 'board') {
            props.history.push({pathname: `/${route}`, search: `?roomId=${hash}&fileId=${fileId}&fileName=${fileName.split('.')[0]}&button=${true}`});
        } else {
            axios.get(`http://51.38.225.18:3000/pedirTexto?usuario=${cookies.get('username')}&nombre=${fileName.split('.')[0]}`).then((response) => {
                let content = JSON.stringify(response.data).replace(/(")/g, "");
                console.log(JSON.stringify(response.data));
                sessionStorage.setItem('content', JSON.stringify(response.data).replace(/\\/g, ""));
                props.history.push({pathname: `/${route}`, search: `?roomId=${hash}&fileId=${fileId}&fileName=${fileName.split('.')[0]}`});
            })
        }
    }
    return (
        <div id="principal-container">
           <h1>Tus archivos</h1>
           <div id='all'>
                {file.map(fil => <FileGrid key={fil.name} file={fil.name} redirect={redirect} setFile={setFile} />)}
           </div>
        </div>
    );
        
} 

export default PremiumPage;