import React, { Component } from 'react';
import { Card, CardBody, CardTitle, CardText, ListGroup, ListGroupItem } from 'reactstrap';


export default class LoginBox extends Component {
    render() {
        if (this.props.staticContext)
            this.props.staticContext.status = 403;
        return (
            <Card className="loginBox">
                <CardBody>
                    <CardTitle>Log In to Continue</CardTitle>
                    <CardText>
                        <ListGroup>
                            {
                                [
                                    ['github', 'Login with GitHub']
                                ].map(x =>
                                    <ListGroupItem key={x[0]} tag="a" href={`/auth/${x[0]}`} action>
                                        {x[1]}
                                    </ListGroupItem>
                                )
                            }
                        </ListGroup>
                    </CardText>
                </CardBody>
            </Card>
        )
    }
}