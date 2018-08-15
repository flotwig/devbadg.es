import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundError from './views/errors/NotFoundError';
import Tokens from './views/tokens/Tokens'

export default class Router extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/tokens" component={Tokens}/>
                <Route component={NotFoundError}/>
            </Switch>
        )
    }
}