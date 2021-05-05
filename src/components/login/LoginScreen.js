import React, { useState } from 'react';
import axios from 'axios';

export const LoginScreen = () => {
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
        axios.post(url, data.form, {headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}}).then((response) => {
            console.log(response);
        })
    }


    return (
        <div>
            <h1>Login Screen</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Usuario" value={data.form.usuario} name="usuario" onChange={handleOnChange} />
                <input type="password" placeholder="Contraseña" value={data.form.password} name="password" onChange={handleOnChange} />
                <input type="submit" value="Iniciar sesión" onClick={handleOnClick} />
            </form>
        </div>
    )
}
