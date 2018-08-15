import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Dropdown } from 'semantic-ui-react';
import './Header.css';

class Header extends Component {
    render() {
        const user = this.props.user
        return (
            <Menu fixed="top" inverted>
                <Menu.Item header href="/">devbadg.es</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item href="/badges">Badges</Menu.Item>
                    {
                        user ? 
                            <Dropdown item text={`${user.slug} - ${user.points} (${user.badges})`} className="user">
                                <Dropdown.Menu>
                                    <Dropdown.Item href={user.profileUrl + '/account'}>My Account</Dropdown.Item>
                                    <Dropdown.Item href={user.profileUrl}>Profile</Dropdown.Item>
                                    <Dropdown.Item href="/auth/logout">Log Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        :
                            <Dropdown item text="Log In" className="login-buttons">
                                <Dropdown.Menu className="login-buttons">  
                                    <Dropdown.Item onClick={()=>window.location='/auth/github'}>
                                        <img src="/assets/github-64px.png" alt="GitHub Login"/> Login with GitHub
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                    }
                </Menu.Menu>
            </Menu>
        )
    }
}

Header = connect(
    (state) => {
        return {
            user: state.user
        }
    },
    (dispatch)=>{
        return {}
    }
)(Header)
export default Header