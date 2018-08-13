import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem,
         NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu,
         DropdownItem } from 'reactstrap';
import './Header.css';

class Header extends Component {
    state = {
        isOpen: false
    }
    render() {
        const user = this.props.user
        return (
            <header>
                <Navbar color="light" expand="md">
                    <NavbarBrand href="/">devbadg.es</NavbarBrand>
                    <NavbarToggler onClick={()=>this.setState({isOpen:!this.state.isOpen})}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/badges">Badges</NavLink>
                            </NavItem>
                            {
                                user ? 
                                    <UncontrolledDropdown nav inNavbar className="user">
                                        <DropdownToggle nav caret>
                                            <span className="slug">{user.slug}</span> &mdash;
                                            {user.points} ({user.badges})
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                :
                                    <UncontrolledDropdown nav inNavbar>
                                        <DropdownToggle nav caret>
                                            Login
                                        </DropdownToggle>
                                        <DropdownMenu right className="login-buttons">  
                                            <DropdownItem onClick={()=>window.location='/auth/github'}>
                                                <img src="/assets/github-64px.png" alt="GitHub Login"/> Login with GitHub
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
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