import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cookies } from '../helpers/createCookies';
import { generateToken } from '../helpers/generateToken';
import axios from 'axios';
import { ToastContainer, Slide } from 'react-toastify';
import { showToast } from '../helpers/toast';

export const AddFile = ({setFiles, redirect}) => {
    // const limit = 5;
    const [inputValue, setInputValue] = useState('');
    const [type, setType] = useState('image');
    const handleInputChange = (e) => {
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
        if(inputValue.trim().length > 2 && inputValue.length < 13) {
            setFiles((files => [{name: inputValue}, ...files]));
            let extension = type === 'image' ? 'png' : 'txt';
            let route = type === 'image' ? 'board' : 'texteditor';
            // let url = `http://51.38.225.18:3000/comprovarArchivo/?nomFichero=${inputValue}&idUsuario=${cookies.get('userId')}&tipo=${extension}`;
            // axios.get(url).then((response) => {
                //     if(response.status === 200) {
                    //         url = "http://51.38.225.18:3000/createFile";
                    //         var canvas = document.getElementById('blankCanvas');
                    //         var ctx = canvas.getContext('2d');
                    //         let data = {
                        //             file: `${inputValue}.${extension}`,
                        //             UsuarioId: cookies.get('userId')
                        //         }
                        //         axios.post(url, data)
                        //         let token = generateToken();
                        //         redirect(route, 1, token);
                        //     }
                        // })
                        let url = 'http://51.38.225.18:3000/newFile';
                        let data = {
                            UsuarioId: cookies.get('userId'),
                            nameFile: inputValue,
                            tipo: extension
                        };
                        axios.post(url, data).then((response) => {
                            console.log(response);
                            if(response.status === 201) {
                                url = `http://51.38.225.18:3000/comprovarArchivo/?nomFichero=${inputValue}&idUsuario=${cookies.get('userId')}&tipo=${extension}`;
                                axios.get(url).then((response) => {
                                    let token = generateToken();
                                    redirect(route, response.data.id, token, `${inputValue}.${extension}`);
                                })
                            }
                        })
                        setInputValue("");
        } else {
            showToast('err', 'El nombre tiene que tener mínimo 3 carácteres y máximo 12');
            setInputValue('');
        }
    }
    
    return (
        <span>
            <form className="switch-field">
                <input type="text" className='fileInput' placeholder='Nombre del archivo' value={inputValue} onChange={handleInputChange} />
                <input type="radio" id="image" name="image" value="image" checked={type === 'image'} onChange={() => setType('image')}/>
                <label htmlFor="image">Imagen</label>
                <input type="radio" id="text" name="text" value="Text" checked={type === 'text'} onChange={() => setType('text')}/>
                <label htmlFor="text">Texto</label>
            </form>
            <input type='button' id='create' className='btnCreate animate' name='create' value='Crear' onClick={createFile} />
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                transition={Slide}
                toastClassName="toastClass"
                closeOnClick
                draggable
            />
        </span>
        
    )
}
AddFile.propTypes = {
    setFiles: PropTypes.func.isRequired
}