/**
 * Token Actions
 */
export const RECEIVE_TOKENS = 'RECEIVE_TOKENS';
export const DELETE_TOKEN = 'DELETE_TOKEN'

export function receiveTokens(tokens) {
    return { type: RECEIVE_TOKENS, tokens }
}

export function deleteToken(tokenId) {
    return { type: DELETE_TOKEN, tokenId }
}

/**
 * User Actions
 */
export const UPDATE_USER_PROPERTY = 'UPDATE_USER_PROPERTY'
export const SET_USER = 'SET_USER'

export function updateUserProperty(user) {
    return { type: UPDATE_USER_PROPERTY, user }
}

export function setUser(user) {
    return { type: SET_USER, user }
}

/**
 * Flash Actions
 */
export const ADD_FLASH_MESSAGE = 'ADD_FLASH_MESSAGE'

export function addFlashMessage(message, color) {
    return { type: ADD_FLASH_MESSAGE, flash: { message, color: color || 'blue' } }
}