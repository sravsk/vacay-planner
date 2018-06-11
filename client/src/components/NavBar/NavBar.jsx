import React from 'react';
import NavLink from 'react-router-dom/NavLink'
import { Menu } from 'semantic-ui-react';

const NavBar = (props) => {
  return (
    props.user === null ?
    (
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
    :
    (
      <Menu borderless pointing fixed='top'>
        <Menu.Item position="left">
          <NavLink to='/' activeClassName='active'>
            Trippin'
          </NavLink>
        </Menu.Item>
        <Menu.Item position="right">
          <NavLink to='/' activeClassName='active'>
            Hello, <span>{props.user.split("@")[0]}</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to='/mytrips' activeClassName='active'>
            My Trips
          </NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to='/' onClick={() => {props.handleLogout()}} activeClassName='active'>
            Log Out
          </NavLink>
        </Menu.Item>
      </Menu>
    )
  )
}

export default NavBar;