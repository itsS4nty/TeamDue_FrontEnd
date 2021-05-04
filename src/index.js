import React from 'react';
import ReactDOM from 'react-dom';
// import PrimeraApp from './PrimeraApp'
import PremiumPage from './PremiumPage';
import './index.css';
import './premiumPage.css';

const divRoot = document.querySelector('#app');
ReactDOM.render( <PremiumPage saludo='Hola que tal' />  , divRoot );