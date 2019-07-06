import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import { Button } from 'reactstrap';


@inject('ScreenStore', 'SessionStore')
@observer
class TypeEventScreen extends Component {
    @observable page = 1
    @observable listEvents = []
    @observable isSuccess = false

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('All event type')
    }

    componentDidMount() {
        fetch(`${this.props.SessionStore.API_URL}event/alltype?page=${this.page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            }
        })
            .then((result) => {
                return result.json();
            }).then((jsonResult) => {
                console.log(jsonResult);
                if (jsonResult.status.code === 200) {
                    this.listEvents = jsonResult.data
                    this.isSuccess = true
                } if (jsonResult.status.code === 401) {
                    this.props.SessionStore.setLoginComplete(false)
                } else {
                    this.isSuccess = false
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <div id="container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">ID</th>
                            <th scope="col" className="text-center">Name</th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.listEvents.map((item, idx) => {
                            return <tr key={idx}>
                                    <td className="text-center">{item.tidd}</td>
                                    <td className="text-center">{item.tname}</td>
                                </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default TypeEventScreen