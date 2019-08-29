import React, { Component } from 'react';
import './css/LoginScreen.css';
import classNames from 'classnames';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, TextField, FormControl, InputLabel, Input } from '@material-ui/core';
import { Accessibility } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from "./custom/Card/Card";
import CardHeader from "./custom/Card/CardHeader.jsx";
import CardIcon from "./custom/Card/CardIcon.jsx";
import CardFooter from "./custom/Card/CardFooter.jsx";

@inject('SessionStore')
@observer
class LoginScreen extends Component {
    @observable userName = ''
    @observable password = ''
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
                    <Card>
                        <CardHeader color="success" stats icon>
                            <CardIcon color="success">
                                <Accessibility />
                            </CardIcon>
                            <h3 className={classes.cardTitle}>
                                Sign in to VGM
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <TextField
                                    required
                                    label="Email"
                                    className={classes.textField}
                                    value={this.userName}
                                    onChange={event => this.userName = event.target.value}
                                    margin="normal" />
                                <FormControl className={classNames(classes.margin, classes.textField)}>
                                    <InputLabel htmlFor="adornment-password">Password *</InputLabel>
                                    <Input
                                        required
                                        id="adornment-password"
                                        type={this.showPassword ? 'text' : 'password'}
                                        value={this.password || ''}
                                        onChange={event => this.password = event.target.value}
                                    />
                                </FormControl>
                                <div className={classes.error}>{this.message}</div>
                            </div>
                        </CardHeader>
                        <CardFooter stats style={{ display: ' flex', justifyContent: 'flex-end' }}>
                            <div>
                                <Button variant="contained" color="primary" onClick={this.handleSubmit}>Sign in</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }
}

const useStyles = theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    error: {
        marginTop: 10,
        color: 'red'
    },
    cardTitle: {
        color: 'black',
        padding: 16,
        fontWeight: 'bold'
    },
})
LoginScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(LoginScreen)
