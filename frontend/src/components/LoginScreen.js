import React, { Component } from 'react';
import './css/LoginScreen.css';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, TextField } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

@inject('SessionStore')
@observer
class LoginScreen extends Component {
    @observable userName = 'ddnhat0411@gmail.com'
    @observable password = '12345678'
    @observable message

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch(`${this.props.SessionStore.API_URL}user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.userName,
                password: this.password
            })
        })
            .then((result) => {
                return result.json();
            }).then((jsonResult) => {
                console.log(jsonResult);
                if (jsonResult.success) {
                    this.props.SessionStore.setUserInfo(jsonResult.data).then(() => this.props.SessionStore.setLoginComplete(true))
                } else {
                    this.message = jsonResult.message
                }
                //this.props.history.push('/');
            }).catch((error) => {
                console.error(error);
                this.message = error.message
            });
    }

    render() {
        if (this.props.SessionStore.isLogin) {
            return <Redirect to='/' />
        }
        const { classes } = this.props;
        return (
            <div className="Login">
                <div className="Login-main">
                    <h1>ADMIN</h1>
                    <div className="Login-main-form">
                        <TextField
                            required
                            label="Email"
                            className={classes.textField}
                            value={this.userName}
                            onChange={event => this.userName = event.target.value}
                            margin="normal" />
                        <TextField
                            required
                            label="Password"
                            className={classes.textField}
                            value={this.password}
                            onChange={event => this.password = event.target.value}
                            margin="normal" />
                        <p className={classes.error}>{this.message}</p>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>Login</Button>
                    </div>
                </div>
            </div>
        );
    }
}
const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    error: {
        marginTop: 10
    }
})
LoginScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginScreen)
