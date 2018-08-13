import React, { Component } from 'react';
import { Alert } from 'reactstrap';

export default class NotFoundError extends Component {
    render() {
        if (this.props.staticContext)
            this.props.staticContext.status = 404;
        return <Alert color="danger">Not found.</Alert>
    }
}