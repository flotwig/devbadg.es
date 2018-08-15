import ReactGA from 'react-ga';

const analytics = !!process.env.GOOGLE_UA_NUMBER

if (analytics) {  
    ReactGA.initialize(process.env.GOOGLE_UA_NUMBER)
}

export const triggerPageview = analytics && (() =>
    ReactGA.pageview(window.location.pathname))