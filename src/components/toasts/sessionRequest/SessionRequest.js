import React from 'react';
import {socket} from '../../../helpers/createSocket';
import {GiCheckMark} from 'react-icons/all'

export const SessionRequest = ({idPeticion, roomKey}) => {
    // ✅ ✔️❌
    return (
        <div>
            <button type="submit" className="cleanBtn">{idPeticion} {roomKey}</button>    
        </div>
    )
}
