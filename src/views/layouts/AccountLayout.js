import React, { Component } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Nav, NavLink } from 'reactstrap';
import { connect } from 'react-redux';

class AccountLayout extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col sm="3">
                        <Nav>
                            {
                                [
                                    ['Profile', '/'],
                                    ['Tokens', '/tokens']
                                ].map(x => <NavLink key={x[0]} href={x[1]}>{x[0]}</NavLink>)
                            }
                        </Nav>
                    </Col>
                    <Col sm="9">
                        {this.props.children}
                    </Col>
                </Row>
            </Container>
        )
    }
}

AccountLayout = connect(
    state => {
        return {
            user: state.user
        }
    },
    dispatch => {
        return {}
    }
)(AccountLayout)

export default AccountLayout