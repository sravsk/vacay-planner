import React from 'react';
import NavLink from 'react-router-dom/NavLink'
import { Menu } from 'semantic-ui-react';
import axios from 'axios';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    axios.get('/user')
      .then(result => {
        this.setState({
          user: result.data
        })
      })
  }

  handleLogout() {
    axios.get('/logout')
      .then(result => {
        if (result.data === 'user logged out') {
          this.setState({
            user: undefined
          })
        }
      })
  }

  render () {
    if (this.state.user) {
      return (
        <Menu borderless pointing fixed='top'>
          <Menu.Item position="left">
            <NavLink to='/' activeClassName='active'>
              Trippin'
            </NavLink>
          </Menu.Item>
          <Menu.Item position="right">
            <NavLink to='/' activeClassName='active'>
              Hello, <span>{this.state.user.split("@")[0]}</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/mytrips' activeClassName='active'>
              My Trips
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/' onClick={this.handleLogout} activeClassName='active'>
              Log Out
            </NavLink>
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu borderless pointing fixed='top'>
          <Menu.Item position="left">
            <NavLink to='/' activeClassName='active'>
              Trippin'
            </NavLink>
          </Menu.Item>
          <Menu.Item position="right">
            <NavLink to='/signup' activeClassName='active'>
              Sign Up
            </NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to='/login' activeClassName='active'>
              Login
            </NavLink>
          </Menu.Item>
        </Menu>
      )
    }
  }
}



export default NavBar;