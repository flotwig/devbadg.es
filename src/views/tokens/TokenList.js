import React, { Component } from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import Ago from 'react-ago-component';


export default class TokenList extends Component {
    render() {
        return (
            <ListGroup>
                {this.props.tokens.map(token => <TokenListItem key={token.tokenId} token={token}/>)}
            </ListGroup>
        )
    }
}

class TokenListItem extends Component {
    render() {
        const token = this.props.token
        return (
            <ListGroupItem>
                <ListGroupItemHeading>{token.provider.name} &mdash; {token.remoteUsername}</ListGroupItemHeading>
                <ListGroupItemText>Created <Ago date={new Date(token.createdAt)}/> &mdash; Last used {token.lastUsedAt ? <Ago date={new Date(token.lastUsedAt)}/> : 'never'}</ListGroupItemText>
            </ListGroupItem>
        )
    }
}