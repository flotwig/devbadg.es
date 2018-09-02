[devbadg.es](https://devbadg.es)
===

[![Build Status](https://travis-ci.org/flotwig/devbadg.es.svg?branch=master)](https://travis-ci.org/flotwig/devbadg.es)

## Directory Structure
```
build/           optimized frontend code after running build
config/          configuration for webpack and deployment
public/          static frontend assets, served from /
scripts/         build scripts
server/          devbadg.es server code. serves API and frontend
src/             React frontend code
```

## React Notes

In production, the React frontend is rendered via Server-Side Rendering. You can see this in action in [server/react-controller.js](server/react-controller.js). The initial page load is populated and rendered before being sent to the user. Once the user loads a page, normal React rendering takes place and data comes from API calls to the backend.

If you want to do rapid front end iteration with live reloading, use `yarn start-react` to start the webpack dev server. Note that this may cause issues with the backend.

## Development

Dependencies:
* Node and npm (tested with v8.11.2)
* PostgreSQL (tested with 10.4)

First, copy `.env.ex` to `.env` and add your secret keys and other information. Then, execute these commands:

```
yarn install  # install dependencies
yarn watch    # begin auto-rebuilding React frontend
yarn start    # start backend server on port 8091
```