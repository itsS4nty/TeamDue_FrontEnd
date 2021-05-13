import React from 'react';
import {socket} from '../../../helpers/createSocket';
import {GiCheckMark} from 'react-icons/all'

export const SessionRequest = ({idPeticion, nombreUsuario, roomKey}) => {
    // ✅ ✔️❌
    const handleAnswer = (e) => {
        e.preventDefault();
        var jsonToSend = {
            idPeticion: idPeticion,
            roomKey: roomKey
        }
        socket.emit(e.target.name, jsonToSend);
    }
    return (
        <div>
            <p className='toastRequestText'>¿Permitir al usuario {nombreUsuario} entrar a la sala?</p>
            <div className='center-horizontal'>
                <button type="submit" name='aceptado-room' className="cleanBtn" onClick={handleAnswer}>✔️</button>    
                <button type="submit" name='rechazado-room' className="cleanBtn" onClick={handleAnswer}>❌</button>    
            </div>
        </div>
    )
}
