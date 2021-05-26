import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cookies } from '../helpers/createCookies';
import axios from 'axios';
import md5 from 'crypto-js/md5';

export const AddFile = ({setFiles, redirect}) => {
    // const limit = 5;
    const [inputValue, setInputValue] = useState('');
    const [type, setType] = useState('image');
    const handleInputChange = (e) => {
        generateToken();
        setInputValue(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // if(!userPremium){
        //     // stuff
        // }
        
    }
    const createFile = (e) => {
        e.preventDefault();
        if(inputValue.trim().length > 2) {
            setFiles((files => [{name: inputValue}, ...files]));
            setInputValue("");
            let url = "http://51.38.225.18:3000/createFile";
            let extension = type === 'image' ? '.png' : '.txt';
            let route = type === 'image' ? 'board' : 'texteditor';
            let data = {
                file: `${inputValue}${extension}`,
                UsuarioId: cookies.get('userId')
            }
            axios.post(url, data).then((response) => {
                if(response.status === 200) {
                    let token = generateToken();
                    redirect(route, 'hash');
                }
            })
        }
    }
    const generateToken = () => {
        var date = Date.now() * Math.floor(Math.random() * 1001);
        console.log(date);

    }
    return (
        <>
            <form className="switch-field">
                <input type="text" value={inputValue} onChange= {handleInputChange} />
                <input type="radio" id="image" name="image" value="image" checked={type === 'image'} onChange={() => setType('image')}/>
                <label htmlFor="image">Imagen</label>
                <input type="radio" id="text" name="text" value="Text" checked={type === 'text'} onChange={() => setType('text')}/>
                <label htmlFor="text">Texto</label>
            </form>
            <input type='button' id='create' name='create' value='Crear' onClick={createFile} />
        </>
    )
}
AddFile.propTypes = {
    setFiles: PropTypes.func.isRequired
}

