import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const AddFile = ({setFiles}) => {
    const limit = 5;
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // if(!userPremium){
        //     // stuff
        // }
        if(inputValue.trim().length > 2) {
            setFiles((files => [{name: inputValue}, ...files]));
            setInputValue("");
        }
        
        
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={inputValue} onChange= {handleInputChange} />
        </form>
    )
}
AddFile.propTypes = {
    setFiles: PropTypes.func.isRequired
}
