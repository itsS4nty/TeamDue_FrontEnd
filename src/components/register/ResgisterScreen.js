import React, { useState } from 'react';
import axios from 'axios';

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
            if(status === 201) {
                props.history.push('/login');
            }
        })
    }
    return (
        <div id="principal-container">
            <h1>Register Screen</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nombre" value={data.form.nombre} name="nombre" onChange={handleOnChange} />
                <input type="text" placeholder="Primer apellido" value={data.form.apellidos} name="apellido1" onChange={handleOnChange} />
                <input type="text" placeholder="Segundo apellido" value={data.form.apellidos} name="apellido2" onChange={handleOnChange} />
                <input type="email" placeholder="Email" value={data.form.email} name="correo" onChange={handleOnChange} />
                <input type="text" placeholder="Usuario" value={data.form.usuario} name="usuario" onChange={handleOnChange} />
                <input type="password" placeholder="Contraseña" value={data.form.password} name="password" onChange={handleOnChange} />
                <input type="submit" value="Iniciar sesión" onClick={handleOnClick} />
            </form>
        </div>
    )
}
