import React, { Component } from 'react';
import '../css/ItemEvent.css';
import { Button } from 'reactstrap';
import { inject, observer } from 'mobx-react';

@inject('ScreenStore')
@observer
class ItemUser extends Component {

    constructor(props) {
        super(props)
        this.handleEditItem = this.handleEditItem.bind(this)
    }

    handleEditItem(e) {
        e.preventDefault()
        //this.props.ScreenStore.setEditEventStage(true, this.props.eventData)
    }

    handleDeleteItem = (e) => {
        e.preventDefault()
        fetch(`${this.props.SessionStore.API_URL}user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                id: this.props.data.id
            })
        }).then((result) => {
                return result.json();
            }).then((jsonResult) => {
                console.log(jsonResult);
                if (jsonResult.success) {
                    console.log('Delete user id success', this.props.data.id)
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {
        // if (this.props.ScreenStore.isEditEventStage) {
        //     return <Redirect to='/edit-event' />
        // }
        const { data, index } = this.props

        return (
            <tr>
                <th scope="row" className="text-center">{index + 1}</th>
                <td className="text-center">{data.id}</td>
                <td className="text-center">{data.role}</td>
                <td className="text-center">{data.email}</td>
                <td className="text-center">{data.name}</td>
                <td className="text-center">{data.phone}</td>
                <td className="text-center">{data.address}</td>
                <td className="text-center"><Button color="secondary" onClick={this.handleEditItem}>Edit</Button> {' '} <Button color="danger" onClick={this.handleDeleteItem}>Delete</Button></td>
            </tr>
        );
    }
}
export default ItemUser