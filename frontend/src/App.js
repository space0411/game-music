import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import PropTypes from 'prop-types';
import {
  withStyles, AppBar, CssBaseline, Divider, Drawer,
  Hidden, IconButton, List, ListItem, ListItemIcon,
  ListItemText, Toolbar, Typography, ExpansionPanel, ExpansionPanelDetails,
  ExpansionPanelSummary
} from '@material-ui/core';
import { Mail, Dashboard, AccountCircle, RestaurantMenu, Menu, ExpandMore, FiberNew } from '@material-ui/icons';

import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import UserScreen from './components/UserScreen';
import CreateUserScreen from './components/CreateUserScreen';
import ProductsScreen from './components/ProductsScreen';
import CreateProductsScreen from './components/CreateProductScreen';
import FlatformScreen from './components/FlatformScreen';
import GenreScreen from './components/GenreScreen';
import GameScreen from './components/GameScreen';
import DeveloperScreen from './components/DeveloperScreen';
import MusicPlayerDialog from './components/dialog/MusicPlayerDialog';

const drawerWidth = 300;

@inject('SessionStore', 'ScreenStore')
@observer
class App extends Component {

  state = {
    mobileOpen: false,
    expanded: null,
    navList: [
      { 'title': 'Dashboard', 'content': [] },
      { 'title': 'User', 'content': [{ 'name': 'Users', 'url': 'user' }, { 'name': 'Create new user', 'url': 'new-user' }] },
      {
        'title': 'Product', 'content': [
          { 'name': 'Products', 'url': 'product' },
          { 'name': 'Music', 'url': 'music' },
          { 'name': 'Flatform', 'url': 'flatform' },
          { 'name': 'Genre', 'url': 'genre' },
          { 'name': 'Game', 'url': 'game' },
          { 'name': 'Developer', 'url': 'developer' },
        ]
      },
      {
        'title': 'Generate new...', 'content': [
          { 'name': 'Product', 'url': 'new-product' },
          { 'name': 'Music', 'url': 'new-music' },
          { 'name': 'Flatform', 'url': 'new-flatform' },
          { 'name': 'Genre', 'url': 'new-genre' },
          { 'name': 'Game', 'url': 'new-game' },
          { 'name': 'Developer', 'url': 'new-developer' },
        ]
      },
      { 'title': 'Feedback', 'content': [] }
    ]
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  constructor(props) {
    super(props)
    this.props.SessionStore.checkingUserLogin()
  }

  render() {
    const { classes, theme } = this.props;
    const { expanded } = this.state;
    const drawer = (
      <div style={{ overflowX: 'hidden' }}>
        <div className={classes.toolbar}>
          <h4 className="text-center mt-3">Administration</h4>
        </div>
        <Divider />
        <List style={{ paddingLeft: 8, paddingRight: 8 }}>
          {this.state.navList.map((item, index) => (
            <ExpansionPanel key={index} expanded={expanded === 'panel' + index} onChange={this.handleChange('panel' + index)}>
              <ExpansionPanelSummary expandIcon={item.content.length > 0 ? <ExpandMore /> : null}>
                {/* <Link to={item.title} className='d-flex ml-1 row w-100'> */}
                {/* <Typography component={'span'} className={classes.heading}> */}
                <ListItemIcon>
                  {
                    index === 0 ? <Dashboard className={classes.icon} /> :
                      index === 1 ? <AccountCircle className={classes.icon} /> :
                        index === 2 ? <RestaurantMenu className={classes.icon} /> :
                          index === 3 ? <FiberNew className={classes.icon} /> : <Mail className={classes.icon} />
                  }
                </ListItemIcon>
                {/* </Typography> */}
                <Typography component={'span'} className={classes.secondaryHeading}>{item.title}</Typography>
                {/* </Link> */}
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className='d-flex row'>
                {item.content.map((childItem, childIndex) => (
                  <Link to={childItem.url} key={childIndex} className='w-100'>
                    <ListItem button>
                      <ListItemText primary={childItem.name} />
                    </ListItem>
                  </Link>
                ))}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </List>
      </div>
    );
    return (
      <BrowserRouter>
        {(this.props.SessionStore.isLogin) ?
          <div>
            <div className={classes.root}>
              <CssBaseline />
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.menuButton}
                  >
                    <Menu />
                  </IconButton>
                  <Typography variant="h6" color="inherit" noWrap>
                    {this.props.ScreenStore.title}
                  </Typography>
                </Toolbar>
              </AppBar>
              <nav className={classes.drawer} >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                  <Drawer
                    container={this.props.container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={this.state.mobileOpen}
                    onClose={this.handleDrawerToggle}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                  >
                    {drawer}
                  </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Drawer
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                  >
                    {drawer}
                  </Drawer>
                </Hidden>
              </nav>
              <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                  <Route exact path="/" component={DashboardScreen} />
                  <Route path="/login" component={LoginScreen} />
                  <Route path="/dashboard" component={DashboardScreen} />
                  <Route path="/user" component={UserScreen} />
                  <Route path="/new-user" component={CreateUserScreen} />
                  <Route path="/product" component={ProductsScreen} />
                  <Route path="/new-product" component={CreateProductsScreen} />
                  <Route path="/edit-product" component={CreateProductsScreen} />
                  <Route path="/flatform" component={FlatformScreen} />
                  <Route path="/genre" component={GenreScreen} />
                  <Route path="/game" component={GameScreen} />
                  <Route path="/developer" component={DeveloperScreen} />
                </Switch>
              </main>
            </div>
            <MusicPlayerDialog />
          </div> :
          <LoginScreen />
        }
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.primary,
  },
  icon: {
    // margin: 0,
    // width: 32
  },
});

export default withStyles(styles, { withTheme: true })(App);
