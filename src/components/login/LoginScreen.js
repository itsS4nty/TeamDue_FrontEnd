import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, Slide } from 'react-toastify';
import {cookies} from '../../helpers/createCookies';
import { showToast } from '../../helpers/toast';

export const LoginScreen = (props) => {
    const [data, setData] = useState({form: {usuario: "", password:""}, error: false, errorMsg: ""});
    const handleSubmit = (e) => {
        e.preventDefault();
    }
    const handleOnChange = async (e) => {
        await setData({
            form: {
                ...data.form,
                [e.target.name]: e.target.value
            }
        })
    }
    const handleOnClick = () => {
        let url = "http://51.38.225.18:3000/login";
        axios.post(url, data.form).then((response) => {
            console.log(response);
            console.log(response.status);
            switch (response.status) {
                case 200:
                    cookies.set('premium', response.data.usuario.premium);
                    cookies.set('loggedIn', true);
                    cookies.set('username', response.data.usuario.usuario);
                    cookies.set('userId', response.data.usuario.id);
                    props.history.push('/files');
                    break;
                default:
                    showToast('err', 'Error general, inténtelo de nuevo más tarde')
                    break;
            }
        }).catch(error => {
            switch(error.response.status) {
                case 409:
                    showToast('err', 'Contraseña incorrecta');
                    break;
                case 404:
                    console.log(1312)
                    showToast('err', 'Usuario no encontrado');
                    break;
                case 403:
                    showToast('info', 'Tienes que validar tu correo antes de poder iniciar sesión');
                    break;
                default:
                    showToast('err', 'Error general, inténtelo de nuevo más tarde')
                    break;
            }
        });
    }
    const redirectRegister = (e) => {
        e.preventDefault();
        props.history.push('/register');
    }
    return (
        <div id="principal-container">
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit} className='lrBlock'>
                <input autoComplete="off" name="hidden" type="text" hidden />
                <input type="text" placeholder="Usuario" className='lrInput' value={data.form.usuario} name="usuario" onChange={handleOnChange} /> <br />
                <input type="password" placeholder="Contraseña" className='lrInput' value={data.form.password} name="password" onChange={handleOnChange} /> <br />
                <input type="submit" value="Iniciar sesión" onClick={handleOnClick} /> <br />
                <span className='infoLR'>¿No tienes cuenta? <span id='redirect' onClick={redirectRegister}>¡Regístrate!</span></span>
            </form>
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
        </div>
    )
}
