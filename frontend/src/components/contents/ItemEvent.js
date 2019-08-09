import React, { Component } from 'react';
import '../css/ItemEvent.css';
import Moment from 'react-moment';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('ScreenStore')
@observer
class ItemEvent extends Component {

    constructor(props) {
        super(props)
        this.handleEditItem = this.handleEditItem.bind(this)
    }

    handleEditItem(e) {
        e.preventDefault()
        this.props.ScreenStore.setEditEventStage(true, this.props.eventData)
    }

    render() {
        if (this.props.ScreenStore.isEditEventStage) {
            return <Redirect to='/edit-event' />
        }
        const { eventData, index } = this.props
        const startDate = new Date(eventData.startdate)
        const endDate = new Date(eventData.enddate)
        return (
            <tr>
                <th scope="row" className="text-center">{index + 1}</th>
                <td className="text-center">{eventData.eidd}</td>
                <td className="text-center">{eventData.tidd}</td>
                <td className="text-center">{eventData.auidd}</td>
                <td >{eventData.ename}</td>
                <td className="text-center"><Moment format="DD/MM/YYYY HH:mm">{startDate}</Moment> - <Moment format="DD/MM/YYYY HH:mm">{endDate}</Moment></td>
                <td><Button color="primary" onClick={this.handleEditItem}>Edit</Button> {' '} <Button color="secondary">Delete</Button></td>
            </tr>
        );
    }
}
export default ItemEvent