import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { Container } from '../components/container/Container'
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
                    <Redirect to="/files" />
                </Switch>
            </div>   
        </>
    )
}
