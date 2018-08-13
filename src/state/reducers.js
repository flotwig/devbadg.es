import { combineReducers } from 'redux';
import * as Actions from './actions';

function tokens(state = [], action) {
    switch (action.type) {
        case Actions.DELETE_TOKEN:
            return [
                ...state.filter(token => !token.tokenId === action.tokenId)
            ]
        case Actions.RECEIVE_TOKENS:
            return action.tokens
        default:
            return state
    }
}

function user(state = false, action) {
    switch (action.type) {
        case Actions.UPDATE_USER_PROPERTY:
            return Object.assign(state, action.user)
        case Actions.SET_USER:
            return action.user
        default:
            return state
    }
}

function flash(state = {}, action) {
    switch(action.type) {
        case Actions.ADD_FLASH_MESSAGE:
            return action.flash
        default:
            return state
    }
}

const combinedReducer = combineReducers({
    tokens,
    user,
    flash
})

export default combinedReducer;