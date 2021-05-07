import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
// import PrimeraApp from './PrimeraApp'
import PremiumPage from './PremiumPage';
// import './components/container/container.css';
// import './components/container/board/board.css';
import './index.css';
import './premiumPage.css';
import { AppRouter } from './routers/AppRouter';

const divRoot = document.querySelector('#app');
ReactDOM.render( <AppRouter />  , divRoot );