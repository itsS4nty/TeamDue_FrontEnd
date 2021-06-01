import React from 'react';
import { generateToken } from '../helpers/generateToken';


export const FileGridItem = ({id, nombre, tipo, UsuarioId, redirect}) => {
    const openFile = (e) => {
        e.preventDefault();
        let route = e.target.name === 'png' ? 'board' : 'texteditor';
        let token = generateToken();
        redirect(route, e.target.id, token, e.target.className);
    }
    return (
        <div className='files'>
            <p>{nombre}.{tipo}</p>
            <input type='button' id={id} name={tipo} className={nombre} value='Abrir' onClick={openFile} style={{
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                position: 'relative',
                padding: '10px 40px',
                margin: '15px 0px 10px 0px',
                'border-radius': '3px',
                'font-family': 'Lato, sans-serif',
                'font-size': '14px',
                color: '#FFF',
                'text-decoration': 'none',
            /* background-color: #3498db;
                border-bottom: 5px solid #2980B9;
                text-shadow: 0px -2px #2980B9; */
                'background-color': '#01497c',
                'border-bottom': '5px solid #013a63',
                'text-shadow': '0px -2px #013a63',
            }}/>
        </div>
    )
}
