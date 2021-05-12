import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { Container } from '../components/container/Container'
import { SesionScreen } from '../components/sesion/SesionScreen'
import { Navbar } from '../components/ui/Navbar'
import PremiumPage from '../PremiumPage'

export const DashboardRoutes = () => {
    return (
        <>
            <Navbar />
            <div>
                <Switch>
                    <Route exact path="/files" component={PremiumPage}></Route>
                    <Route exact path="/board" component={Container}></Route>
                    <Route exact path="/sesion" component={SesionScreen}></Route>
                    <Redirect to="/files" />
                </Switch>
            </div>   
        </>
    )
}
