import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteToken } from '../../state/actions'
import { Header } from 'semantic-ui-react';
import TokenList from './TokenList'
import AccountLayout from '../layouts/AccountLayout'

class Tokens extends Component {
    render() {
        return (
            <AccountLayout>
                <Header as="h1">Tokens</Header>
                <p>These services have been connected with your account.</p>
                <TokenList tokens={this.props.tokens}/>
            </AccountLayout>
        )
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