import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

@inject('SessionStore')
@observer
class Nav extends Component {
  @observable nameUser = ''

  componentDidMount() {
    this.props.SessionStore.getUserInfo().then((result) => {
      const userInfo = JSON.parse(result)
      this.nameUser = userInfo.user.name + " (" + userInfo.user.role + ")"
    }).catch((err) => {
      console.log(err)
    });
  }

  handleLogout = (e) => {
    e.preventDefault()
    fetch(`${this.props.SessionStore.API_URL}user/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
      }
    })
      .then((result) => {
        return result.json();
      }).then((jsonResult) => {
        console.log(jsonResult);
        if (jsonResult.success) {
          this.props.SessionStore.logOut()
          window.history.replaceState(null, null, "/");
        } else {
          alert(jsonResult.message)
        }
      }).catch((error) => {
        console.error(error);
        alert(error.message)
      });
  }

  render() {
    return (
      <nav id="sidebar">
        <div className="sidebar-header">
          <h3>Administration</h3>
          <h5>{this.nameUser}</h5>
        </div>
        <ul className="list-unstyled components">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/user">User</Link>
          </li>
          <li>
            <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Event</a>
            <ul className="collapse list-unstyled" id="homeSubmenu">
              <li>
                <Link to="/all-event">All</Link>
              </li>
              <li>
                <Link to="/create-event">Create</Link>
              </li>
              <li>
                <Link to="/type-event">Type</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/booking">Booking</Link>
          </li>
          <li>
            <Link to="/booking">Contact</Link>
          </li>
        </ul>
        <ul className="list-unstyled CTAs">
          <li>
            <a href="#" className="download">Download app</a>
          </li>
          <li>
            <a href="#" className="article">Client Website</a>
          </li>
          <li>
            <a onClick={this.handleLogout} className="logout">Logout</a>
          </li>
        </ul>
      </nav>

    );
  }
}

export default Nav