import React, { Component } from 'react';
import { Message, Container } from 'semantic-ui-react';

export default class NotFoundError extends Component {
    render() {
        if (this.props.staticContext)
            this.props.staticContext.status = 404;
        return (
            <Container text style={{marginTop: '3em'}}>
                <Message negative>
                    <Message.Header>404 Not Found</Message.Header>
                    <p>The requested page could not be found.</p>
                </Message>
            </Container>
        )
    }
}