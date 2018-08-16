import React, { Component } from 'react';
import { Item, Button } from 'semantic-ui-react';
import { Ago } from 'react-ago-component';

export default class TokenListItem extends Component {
    render() {
        const token = this.props.token
        return (
            <Item>
                <Item.Image size="tiny" src={'/assets/providers/'+token.provider.slug+'.png'}/>
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