import React from 'react';
import PropTypes from 'prop-types';
// import React, { Fragment } from 'react';

const PremiumPage = () => {

    return (
        <>
           <h1>Tus archivos</h1>
           <div id='createFile'>
               <p>Crear archivo</p>
               <button>+</button>
           </div>
        </>
    );
        
} 

PremiumPage.propTypes = {
    saludo: PropTypes.string.isRequired
}

PremiumPage.defaultProps = {
    subtitulo: 'Soy un subtitulo'
}


export default PremiumPage;