// Global nav bar for home after user has logged in

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../stylesheets/home-nav.css';
import axios from 'axios';

class HomeNavBar extends Component {
  constructor() {
    super();
    this.state = {
      expandMenu: false
    };
  }

  handleMenuClick = () => {
    this.setState({
      expandMenu: !this.state.expandMenu
    });
  }

  handleCloseMenu = () => {
    this.setState({
      expandMenu: false
    });
  }

  render() {
    const { expandMenu } = this.state; 

    const expandClass = expandMenu ? 'home-nav-bar-mobile-expand' : null;

    return (
      <div>
        <div className="home-nav-bar">
          <div className="home-nav-left">
            <Link to="/">
              <img
                src="https://i.imgur.com/JdYm85w.png"
                alt="elevate"
              />
            </Link>
            <h3><Link to="/">JOBS</Link></h3>
            <h3><Link to="/addjob">ADD JOB</Link></h3>
            <h3><Link to="/leaderboard">LEADERBOARD</Link></h3>
            <h3><Link to="/community">COMMUNITY</Link></h3>
          </div>
          <div className="home-nav-right">
            <div className="home-nav-exp-container">
              <img src="https://i.imgur.com/oudBkRW.png" alt="exp-coins" />
              <p>{this.props.experience}</p>
            </div>
            <Link to="/profile"><i className="far fa-user-circle fa-2x"></i></Link>
          </div>
        </div>{/* End nav bar web browser */}

        <div className="home-nav-bar-mobile">
          <div className="home-nav-bar-mobile-fixed">
            <div className="home-nav-bar-bars" onClick={this.handleMenuClick}>
              <i className="fas fa-bars fa-2x"></i>
            </div>

            <div className="home-nav-bar-mobile-right">
              <div className="home-nav-exp-container">
                <img src="https://i.imgur.com/oudBkRW.png" alt="exp-coins" />
                <p>{this.props.experience}</p>
              </div>
              <Link to="/profile"><i className="far fa-user-circle fa-2x"></i></Link>
            </div>
          </div>

          <div className={`home-nav-bar-mobile-dropdown ${expandClass}`}>
            <h3 onClick={this.handleCloseMenu}><Link to="/">JOBS</Link></h3>
            <h3 onClick={this.handleCloseMenu}><Link to="/addjob">ADD JOB</Link></h3>
            <h3 onClick={this.handleCloseMenu}><Link to="/leaderboard">LEADERBOARD</Link></h3>
            <h3 onClick={this.handleCloseMenu}><Link to="/community">COMMUNITY</Link></h3>
          </div>

        </div>{/* End nav bar mobile */}

      </div>
    );
  }
}

export default HomeNavBar;


