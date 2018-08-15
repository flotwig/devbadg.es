import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router } from 'react-router-dom';
import { triggerPageview } from './Analytics'

export const browserHistory = createBrowserHistory()

// don't reload the page if the click is within the domain!
document.addEventListener('click', (e) => {
    const {target} = e
    if (target.tagName === 'A') {
        const {href} = target
        if (href.includes('/auth/')) return; // TODO: make... better?
        const {origin} = window.location
        const originMatches = href.substring(0, origin.length) === origin
        if (originMatches || href.substring(0, 1) === '/') {
                e.preventDefault();
                browserHistory.push(originMatches ? href.substring(origin.length) : href)
            }
    }
})

export function useRouter(e) {
    e.preventDefault(); // do not navigate the browser
    browserHistory.push(e.currentTarget.href)
}

export default class AppRouter extends Component {
    render() {
        return (
            <Router history={browserHistory} onUpdate={triggerPageview || (() => {})}>
                {this.props.children}
            </Router>
        )
    }
}