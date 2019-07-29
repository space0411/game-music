import React, { Component } from 'react';
import './css/LoginScreen.css';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';

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
        return (
            <div className="Login">
                <div className="Login-main">
                    <p className="h1 mb-3">ADMIN</p>
                    <Form className="Login-main-form" onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" placeholder="123abc@gmail.com" value={this.userName || ""} onChange={e => this.userName = e.target.value} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input type="password" name="password" placeholder="***" value={this.password || ""} onChange={e => this.password = e.target.value} />
                        </FormGroup>                
                        <Button type="submit">Submit</Button>
                    </Form>
                    <p className="mt-2">{this.message}</p>
                </div>
            </div>
        );
    }
}
export default LoginScreen