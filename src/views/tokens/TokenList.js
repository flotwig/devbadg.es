import React, { Component } from 'react';
import { Item, Message } from 'semantic-ui-react';
import TokenListItem from './TokenListItem'

export default class TokenList extends Component {
    render() {
        if (this.props.tokens.length === 0) {
            return (
                <Message>
                    No tokens are associated with your account.
                </Message>
            )
        }
        return (
            <Item.Group>
                {this.props.tokens.map(token => <TokenListItem key={token.tokenId} token={token}/>)}
            </Item.Group>
        )
    }
}