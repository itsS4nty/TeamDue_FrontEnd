import React, {useEffect, useState} from 'react';
import {socket} from '../../helpers/createSocket';

export const SesionScreen = (props) => {
    const [roomId, setRoomId] = useState({
        createRoom: '',
        joinRoom: ''
    });
    const handleOnCreateRoom = () => {
        socket.emit("new-room", roomId.createRoom);
        props.history.push('/board');
    }
    const handleRoomIdChange = (e) => {
        setRoomId({
            ...roomId,
            [e.target.name]: e.target.value
        });
    }
    const handleJoinRoom = () => {
        socket.emit("peticionSala-enviada", roomId.joinRoom);
    }
    useEffect(() => {
        if(!socket) return;
        socket.on("err", (data) => {
            console.log(data);
        });
        socket.on("peticionAceptada", (idRoom) => {
            socket.emit("join-room", idRoom);
            props.history.push('/board');
        });
    });

    return (
        <div id="sesion-container">
            <h1>¿Qué quieres hacer?</h1>
            <div id="create-room">
                <div class="data">
                    <form autocomplete="off" method="" action="">
                        <input autocomplete="off" name="hidden" type="text" hidden />
                        <input type="text" name='createRoom' className="inputRoom" value={roomId.createRoom} placeholder="Introduce el ID de la sala" onChange={handleRoomIdChange} />
                        <button type="input" className="btnRoom animate" value="Crear sala" onClick={handleOnCreateRoom}>Crear sala</button>
                    </form>
                </div>
            </div>
            <hr id="sesion-page-hr" />
            <div id="join-room">
                <div class="data">
                    <form autocomplete="off" method="" action="">
                        <input autocomplete="off" name="hidden" type="text" hidden />
                        <input type="text" name='joinRoom' className="inputRoom" value={roomId.joinRoom} placeholder="Introduce el ID de la sala" onChange={handleRoomIdChange} />
                        <button type="input" className="btnRoom animate" value="Unirse a sala" onClick={handleJoinRoom}>Unirse a sala</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
