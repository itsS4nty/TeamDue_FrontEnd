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
            <input type='button' id={id} name={tipo} className={nombre} value='Abrir' onClick={openFile} />
        </div>
    )
}
