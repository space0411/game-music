import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Navbar from "./components/custom/Navbars/Navbar.jsx";
import Footer from "./components/custom/Footer/Footer.jsx";
import Sidebar from "./components/custom/Sidebar/Sidebar.jsx";
import FixedPlugin from "./components/custom/FixedPlugin/FixedPlugin.jsx";
import MusicPlayerDialog from './components/dialog/MusicPlayerDialog';

import routes from "./routes.js";

import dashboardStyle from "./components/assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";

import image from "./components/assets/img/sidebar-2.jpg";
import logo from "./components/assets/img/reactlogo.png";

let ps;
const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

@inject('SessionStore')
@observer
class App extends Component {

  state = {
    image: image,
    color: "blue",
    hasImage: true,
    fixedClasses: "dropdown show",
    mobileOpen: false
  };

  mainPanel = React.createRef();

  handleImageClick = image => {
    this.setState({ image: image });
  };

  handleColorClick = color => {
    this.setState({ color: color });
  };

  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute() {
    return window.location.pathname !== "/admin/maps";
  }

  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  };

  componentDidMount() {
    const { isLogin } = this.props.SessionStore;
    if (navigator.platform.indexOf("Win") > -1 && isLogin) {
      ps = new PerfectScrollbar(this.mainPanel.current);
    }
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.mainPanel.current.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1 && ps) {
      ps.destroy();
    }
    window.removeEventListener("resize", this.resizeFunction);
  }

  constructor(props) {
    super(props)
    this.props.SessionStore.checkingUserLogin()
  }

  render() {
    const { classes, ...rest } = this.props;
    const { isLogin } = this.props.SessionStore;
    if (!isLogin)
      return <Redirect to="/login" />
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"Creative"}
          logo={logo}
          image={this.state.image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color={this.state.color}
          {...rest}
        />
        <div className={classes.mainPanel} ref={this.mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
              <div className={classes.map}>{switchRoutes}</div>
            )}
          {this.getRoute() ? <Footer /> : null}
        </div>
        <MusicPlayerDialog />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyle)(App);
