import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteToken } from '../../state/actions'
import TokenList from './TokenList'

class Tokens extends Component {
    render() {
        return <TokenList tokens={this.props.tokens}/>
    }
}

Tokens = connect(
    (state) => {
        return {
            tokens: state.tokens
        }
    },
    (dispatch) => {
        return {
            onDeleteClick: tokenId => dispatch(deleteToken(tokenId))
        }
    }
)(Tokens)
export default Tokens