import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import { Navbar } from '../components/ui/Navbar'
import PremiumPage from '../PremiumPage'

export const DashboardRoutes = () => {
    return (
        <>
            <Navbar />
            <div>
                <Switch>
                    <Route exact path="/files" component={PremiumPage}></Route>
                    <Redirect to="/files" />
                </Switch>
            </div>   
        </>
    )
}
