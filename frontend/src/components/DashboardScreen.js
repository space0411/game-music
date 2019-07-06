import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import './css/DashboardScreen.css';


@inject('SessionStore', 'ScreenStore')
@observer
class DashboardScreen extends Component {

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('Dashboard')
        this.state = {
            userName: '',
            password: ''
        };
    }

    render() {
        return (
            <div className="container">
                hello
            </div>
        );
    }
}
export default DashboardScreen;