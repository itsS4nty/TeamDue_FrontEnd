import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, Slide } from 'react-toastify';
import { showToast } from '../../helpers/toast';

export const ResgisterScreen = (props) => {
    const [data, setData] = useState({form: {nombre: '', apellido1: '', apellido2: '', correo: '', password: ''}, error: false, errorMsg: ''});
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
        let url = 'http://51.38.225.18:3000/register';
        axios.post(url, data.form).then((response) => {
            console.log(response);
            let {status} = response;
            switch (status) {
                case 201:
                    props.history.push('/login');
                    break;
                default:
                    showToast('err', 'Error general, inténtelo de nuevo más tarde');
                    break;
            }
        }).catch(error => {
            switch(error.response.status) {
                case 409:
                    showToast('err', 'El correo o nombre de usuario proporcionado ya está en uso.');
                    break;
                default:
                    showToast('err', 'Error general, inténtelo de nuevo más tarde');
                    break;
            }
        });
    }
    const redirectLogin = (e) => {
        e.preventDefault();
        props.history.push('/login');
    }
    return (
        <div id="principal-container">
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit} className='lrBlock'>
                <input autoComplete="off" name="hidden" type="text" hidden />
                <input type="text" placeholder="Nombre" className='lrInput' value={data.form.nombre} name="nombre" onChange={handleOnChange} />
                <input type="text" placeholder="Primer apellido" className='lrInput' value={data.form.apellidos} name="apellido1" onChange={handleOnChange} />
                <input type="text" placeholder="Segundo apellido" className='lrInput' value={data.form.apellidos} name="apellido2" onChange={handleOnChange} />
                <input type="email" placeholder="Email" className='lrInput' value={data.form.email} name="correo" onChange={handleOnChange} />
                <input type="text" placeholder="Usuario" className='lrInput' value={data.form.usuario} name="usuario" onChange={handleOnChange} />
                <input type="password" placeholder="Contraseña" className='lrInput' value={data.form.password} name="password" onChange={handleOnChange} />
                <input type="submit" value="Registrarse" onClick={handleOnClick} /> <br />
                <span className='infoLR'>¿Ya tienes cuenta? <span id='redirect' onClick={redirectLogin}>¡Inicia sesión!</span></span>
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
