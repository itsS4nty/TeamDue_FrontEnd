import React, {useEffect, useState} from 'react';
import {socket} from '../../helpers/createSocket';
import { ToastContainer, Slide } from 'react-toastify';
import {showToast} from '../../helpers/toast';
import {cookies} from '../../helpers/createCookies';
export const SesionScreen = (props) => {
    if(!cookies.get('loggedIn')) props.history.push('/login');
    const [roomId, setRoomId] = useState({
        createRoom: '',
        joinRoom: '',
        user: cookies.get('username') 
    });
    const handleOnCreateRoom = (e) => {
        e.preventDefault();
        if(roomId.createRoom.trim().length === 0) {
            showToast('err', 'El nombre de la sala no puede estar vacío');
            return;
        }
        console.log(roomId.createRoom);
        
    }
    const handleRoomIdChange = (e) => {
        setRoomId({
            ...roomId,
            [e.target.name]: e.target.value
        });
    }
    const handleJoinRoom = (e) => {
        e.preventDefault();
        showToast('info', "Petición enviada...");
        console.log(roomId.roomId)
        socket.emit("peticionSala-enviada", {
            room: roomId.joinRoom,
            usuario: cookies.get('username')
        });
    }
    useEffect(() => {
        if(!socket) return;
        socket.on("err", (data) => {
            showToast("err", data);
            console.log(data);
        });
        socket.on("peticionAceptada", (idRoom) => {
            showToast("ok", "¡Entrando en la sala!")
            
            props.history.push({pathname: '/board', search: `?sessionId=${idRoom}`});
        });
        socket.on("peticionRechazada", (idRoom) => {
            showToast("err", `Acceso denegado a la sala ${idRoom}`);
        });
        socket.on("sala-creada", (data) => {
            showToast("ok", "¡Sala creada correctamente!");
            console.log(data)
            props.history.push({pathname: '/board', search: `?sessionId=${data}`});
        })
    }, [props.history]);

    return (
        <div id="sesion-container">
            <h1>¿Qué quieres hacer?</h1>
            <div id="create-room">
                <div className="data">
                    <form autoComplete="off" method="" action="">
                        <input autoComplete="off" name="hidden" type="text" hidden />
                        <input type="text" name='createRoom' className="inputRoom" value={roomId.createRoom} placeholder="Introduce el ID de la sala" onChange={handleRoomIdChange} />
                        <button type="input" className="btnRoom animate" value="Crear sala" onClick={handleOnCreateRoom}>Crear sala</button>
                    </form>
                </div>
            </div>
            <hr id="sesion-page-hr" />
            <div id="join-room">
                <div className="data">
                    <form autoComplete="off" method="" action="">
                        <input autoComplete="off" name="hidden" type="text" hidden />
                        <input type="text" name='joinRoom' className="inputRoom" value={roomId.joinRoom} placeholder="Introduce el ID de la sala" onChange={handleRoomIdChange} />
                        <button type="input" className="btnRoom animate" value="Unirse a sala" onClick={handleJoinRoom}>Unirse a sala</button>
                    </form> 
                </div>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                transition={Slide}
                toastClassName="toastClass"
            />
        </div>
    )
}
