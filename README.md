[devbadg.es](https://devbadg.es)
===

[![Build Status](https://travis-ci.org/flotwig/devbadg.es.svg?branch=master)](https://travis-ci.org/flotwig/devbadg.es)

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