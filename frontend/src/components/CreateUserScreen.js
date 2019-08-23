import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

import { withStyles, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import AlertDialog from './dialog/AlertDialog';


@inject('ScreenStore', 'SessionStore')
@observer
class CreateUserScreen extends Component {
    @observable isEditUserMode = false
    @observable userData
    @observable userID
    @observable email
    @observable name
    @observable password
    @observable address
    @observable phone
    @observable role = 'user'
    @observable showPassword = false
    @observable open = false
    @observable alert = {
        title: 'Ops!',
        content: 'Please fill required information'
    }

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('Create new User')
    }

    componentDidMount() {
        if (this.props.ScreenStore.isEditEventStage) {
            this.userData = this.props.ScreenStore.editEventData
            const userData = this.props.ScreenStore.editEventData
            // Set MODE EDIT
            this.isEditUserMode = true
            if (userData) {
                this.userID = userData.id
                this.name = userData.name
                this.email = userData.email
                this.phone = userData.phone
                this.role = userData.role
                this.address = userData.address
            } else {
                console.log('User data is null! Need back to prev page.')
            }
            // clear Edit Data ScreenStore
            this.props.ScreenStore.clearEditEventStage()
        }
    }

    handleCreateUser = (e) => {
        e.preventDefault()
        if (!this.email || !this.name || !this.password || !this.address || !this.phone) {
            this.open = true
            return
        }
        fetch(`${this.props.SessionStore.API_URL}user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.email,
                role: this.role,
                password: this.password,
                address: this.address,
                phone: this.phone,
                name: this.name
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Alert',
                content: jsonResult.message
            }
            this.open = true
        }).catch((error) => {
            console.error(error);
        });
    }

    handleEditUser = (e) => {
        e.preventDefault()
        if (!this.email || !this.name || !this.address || !this.phone) {
            this.open = true
            return
        }
        fetch(`${this.props.SessionStore.API_URL}user/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.email,
                role: this.role,
                password: this.password,
                address: this.address,
                phone: this.phone,
                name: this.name
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Alert',
                content: jsonResult.message
            }
            this.open = true
        }).catch((error) => {
            console.error(error);
        });
    }

    handleClose = () => {
        this.open = false
    }

    handleClickShowPassword = () => {
        this.showPassword = !this.showPassword
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AlertDialog handleOke={this.handleClose} handleClose={this.handleClose} data={this.alert} open={this.open} />
                <TextField
                    disabled
                    label="Role"
                    className={classes.textField}
                    value={this.role}
                    // onChange={event => this.role = event.target.value}
                    margin="normal"
                /><br></br>
                <TextField
                    disabled={this.isEditUserMode}
                    required
                    label="Email"
                    className={classes.textField}
                    value={this.email || ''}
                    onChange={event => this.email = event.target.value}
                    margin="normal"
                />
                <TextField
                    required
                    label="Name"
                    className={classes.textFieldName}
                    value={this.name || ''}
                    onChange={event => this.name = event.target.value}
                    margin="normal"
                /> <br></br>
                {!this.isEditUserMode &&
                    <FormControl className={classNames(classes.margin, classes.textFieldPassword)}>
                        <InputLabel htmlFor="adornment-password">Password *</InputLabel>
                        <Input
                            required
                            id="adornment-password"
                            type={this.showPassword ? 'text' : 'password'}
                            value={this.password || ''}
                            onChange={event => this.password = event.target.value}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                }
                <br></br>
                <TextField
                    required
                    label="Phone"
                    className={classes.textField}
                    value={this.phone || ''}
                    onChange={event => this.phone = event.target.value}
                    margin="normal"
                />
                <TextField
                    required
                    label="Address"
                    className={classes.textFieldName}
                    value={this.address || ''}
                    onChange={event => this.address = event.target.value}
                    margin="normal"
                />
                <br></br>
                <br></br>
                <Button variant="contained" color="primary" className={classes.button} onClick={this.isEditUserMode ? this.handleEditUser : this.handleCreateUser}>Submit</Button>
            </div>
        );
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    textFieldName: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    margin: {
        margin: theme.spacing(1),
    },
    textFieldPassword: {
        flexBasis: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});

CreateUserScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(CreateUserScreen);