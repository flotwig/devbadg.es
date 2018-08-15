import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Menu, Container } from 'semantic-ui-react';
import AuthRequiredError from '../errors/AuthRequiredError';

class AccountLayout extends Component {
    render() {
        if (!this.props.user) return <AuthRequiredError/>
        return (
            <Container type="text">
                <Grid relaxed>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Menu vertical>
                                {
                                    [
                                        ['Profile', '/'],
                                        ['Settings', '/settings'],
                                        ['Tokens', '/tokens']
                                    ].map(x => <Menu.Item key={x[0]} href={this.props.user.profileUrl + '/' + x[1]}>{x[0]}</Menu.Item>)
                                }
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={13}>
                            {this.props.children}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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