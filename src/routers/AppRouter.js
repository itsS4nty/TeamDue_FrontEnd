import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { LoginScreen } from '../components/login/LoginScreen';
import { ResgisterScreen } from '../components/register/ResgisterScreen';
import { DashboardRoutes } from './DashboardRoutes';

export const AppRouter = () => {
    return (
        <Router>
        <div>
          <Switch>
            <Route exact path="/login" component={LoginScreen}/>
            <Route exact path="/register" component={ResgisterScreen}/>
            <Route path="/" component={DashboardRoutes}/>
          </Switch>
        </div>
      </Router>
    )
}
