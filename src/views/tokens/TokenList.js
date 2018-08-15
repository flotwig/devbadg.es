import React, { Component } from 'react';
import { Item, Message, Button } from 'semantic-ui-react';
import Ago from 'react-ago-component';


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

class TokenListItem extends Component {
    render() {
        const token = this.props.token
        return (
            <Item>
                <Item.Image size="tiny" src={'/assets/'+token.provider.slug+'-64px.png'}/>
                <Item.Content>
                    <Item.Header>{token.provider.name} &mdash; {token.remoteUsername}</Item.Header>
                    <Item.Meta>
                        Created <Ago date={new Date(token.createdAt)}/> &mdash;{' '}
                        Last used {token.lastUsedAt ? <Ago date={new Date(token.lastUsedAt)}/> : 'never'}
                    </Item.Meta>
                    <Item.Extra>
                        <Button negative floated="right">Delete</Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        )
    }
}