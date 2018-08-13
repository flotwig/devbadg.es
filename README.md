[devbadg.es](https://devbadg.es)
===

## Development

Dependencies:
* Node and npm (tested with v8.11.2)
* PostgreSQL (tested with 10.4)

First, copy `.env.ex` to `.env` and add your secret keys and other information. Then, execute these commands:

```
yarn install  # install frontend dependencies
yarn build    # build frontend
cd ./server   # open server directory
yarn install  # install backend dependencies
yarn start    # start server
```