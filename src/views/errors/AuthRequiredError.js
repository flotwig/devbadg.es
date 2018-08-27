import React, { Component } from 'react';
import { Icon, Message, Container } from 'semantic-ui-react';

export default class AuthRequiredError extends Component {
    render() {
        if (this.props.staticContext)
            this.props.staticContext.status = 401;
        return (
            <Container text style={{marginTop: '3em'}}>
                <Message icon warning>
                    <Icon name="key"/>
                    <Message.Content>
                        <Message.Header>You must be logged in to do that!</Message.Header>
                        <p>Register or log in to proceed.</p>
                    </Message.Content>
                </Message>
            </Container>
        )
    }
}