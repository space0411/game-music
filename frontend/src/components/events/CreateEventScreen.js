/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import '../css/CreateEvent.css';
import { observable } from 'mobx';
import { Button, Form, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardTitle, CardImg, CardImgOverlay } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { SketchPicker } from 'react-color';
import Moment from 'react-moment';

@inject('SessionStore', 'ScreenStore')
@observer
class CreateEventScreen extends Component {
    @observable eName = ''
    @observable shortDec = ''
    @observable fullDec = ''
    @observable startDate = new Date()
    @observable endDate = new Date()
    @observable location = ''
    @observable url = ''
    @observable banner
    @observable logo
    @observable bannerValue = ''
    @observable logoValue = ''
    @observable fee = ''

    @observable dropdownOpen = false
    @observable typeItemSelected = { tidd: 0, tname: 'Choose  event type' }
    @observable typeEventData = [
        { tidd: 1, tname: 'Hoc' },
        { tidd: 2, tname: 'An' },
        { tidd: 3, tname: 'Choi' }
    ]
    @observable nameBackground = '#fff'
    @observable bannerPreview = ''
    @observable sponsor = false

    @observable logoPre = ''
    @observable bannerPre = ''

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('Create Event')

        this.toggle = this.toggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChangeTextColor = this.handleChangeTextColor.bind(this)
    }

    componentDidMount() {
        const { isEditEventStage, editEventData } = this.props.ScreenStore
        if (isEditEventStage && editEventData) {
            this.props.ScreenStore.setTitle('Edit Event')
            this.eName = editEventData.ename
            this.shortDec = editEventData.shortdecription
            this.fullDec = editEventData.fulldecription
            this.startDate = new Date(editEventData.startdate)
            this.endDate = new Date(editEventData.enddate)
            this.location = editEventData.location
            this.url = editEventData.url
            this.fee = editEventData.fee
            for (let item of this.typeEventData) {
                if (item.tidd === editEventData.tidd)
                    this.typeItemSelected = item
            }
            this.sponsor = editEventData.sponsor
            this.nameBackground = editEventData.color
            this.logoPre = editEventData.logo
            this.bannerPre = editEventData.banner
        }
    }

    componentWillUnmount() {
        this.props.ScreenStore.setEditEventStage(false, null)
    }

    toggle() {
        this.dropdownOpen = !this.dropdownOpen
    }

    handleChangeTextColor(color) {
        this.nameBackground = color.hex
    }

    handleSubmit(event) {
        event.preventDefault();
        let formData = new FormData()
        formData.append('banner', this.banner)
        formData.append('logo', this.logo)
        formData.append('AUIDD', this.props.SessionStore.getAUIDD())
        formData.append('ENAME', this.eName)
        formData.append('TIDD', this.typeItemSelected.tidd)
        formData.append('SHORTDECRIPTION', this.shortDec)
        formData.append('FULLDECRIPTION', this.fullDec)
        formData.append('STARTDATE', this.startDate.getTime())
        formData.append('ENDDATE', this.endDate.getTime())
        formData.append('LOCATION', this.location)
        formData.append('URL', this.url)
        formData.append('FEE', this.fee)
        formData.append('COLOR', this.nameBackground)
        formData.append('SPONSOR', this.sponsor)

        let URL = `${this.props.SessionStore.API_URL}event/create`
        if (this.props.ScreenStore.isEditEventStage) {
            console.log('URL Update Event')
            URL = `${this.props.SessionStore.API_URL}event/update`
            formData.append('EIDD', this.props.ScreenStore.editEventData.eidd)
            formData.append('LOGOPRE', this.logoPre)
            formData.append('BANNERPRE', this.bannerPre)
        }
        let toastId = null;
        toastId = toast('Upload in progress, please wait...', { autoClose: false })
        fetch(URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: formData
        })
            .then((result) => {
                // Get the result
                // If we want text, call result.text()
                console.log(result);
                return result.json();
            }).then((jsonResult) => {
                // Do something with the result
                console.log(jsonResult);
                if (jsonResult.code === 200) {
                    toast.update(toastId, { type: toast.TYPE.SUCCESS, autoClose: 5000 })
                } else {
                    toast.update(toastId, { type: toast.TYPE.ERROR, autoClose: 5000 })
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    render() {

        return (
            <div id="container">
                <ToastContainer />
                <Form className="main-form" onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="type">Event type</Label>
                        <Dropdown isOpen={this.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret>
                                {this.typeItemSelected.tname}
                            </DropdownToggle>
                            <DropdownMenu>
                                {
                                    this.typeEventData.map((item, index) =>
                                        <DropdownItem key={index} onClick={(e) => this.typeItemSelected = item}>{item.tname}</DropdownItem>
                                    )
                                }
                            </DropdownMenu>
                        </Dropdown>
                    </FormGroup>
                    <FormGroup check>
                        <Label check className="mb-2"><Input type="checkbox" checked={this.sponsor} onChange={() => this.sponsor = !this.sponsor}/> {' '} Sponsor</Label> 
                    </FormGroup>
                    <FormGroup>
                        <Label for="type" className="mr-3">Start date</Label>
                        <DatePicker
                            todayButton={"Today"}
                            selected={this.startDate}
                            onChange={dateSelect => this.startDate = dateSelect}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy h:mm aa"
                            timeCaption="time"
                            placeholderText="Click to select a date"
                        />
                        <Label for="type" className="mr-3 ml-3">End date</Label>
                        <DatePicker
                            todayButton={"Today"}
                            selected={this.endDate}
                            onChange={dateSelect => this.endDate = dateSelect}
                            minDate={this.startDate}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy h:mm aa"
                            timeCaption="time"
                            placeholderText="Click to select a date"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="eName">Event name</Label>
                        <Input type="text" name="eName" placeholder="Limit 100 char" value={this.eName || ''} onChange={(e) => this.eName = e.target.value} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="eName">Event color</Label>
                        <SketchPicker
                            color={this.nameBackground}
                            onChangeComplete={this.handleChangeTextColor}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="mr-3">Logo (100x100)px</Label>
                        <input type="file" name="logoImg" onChange={(e) => {
                            this.logo = e.target.files[0]
                            this.logoValue = e.target.value
                        }} value={this.logoValue} />
                    </FormGroup>
                    <FormGroup>
                        <Label className="mr-3">Banner</Label>
                        <input type="file" name="bannerImg" onChange={(e) => {
                            this.banner = e.target.files[0]
                            this.bannerValue = e.target.value
                            let reader = new FileReader()
                            this.bannerPreview = reader.result
                            reader.readAsDataURL(this.banner)
                        }} value={this.bannerValue} />
                    </FormGroup>

                    <FormGroup>
                        <Label className="mr-3">Review event</Label>
                        <Card className="previewCard">
                            <CardImg width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=320%C3%97480&w=320&h=480&bg=fff&txtclr=333" alt="Card image cap" />
                            <CardImgOverlay>
                                <div className="w-100 h-100 d-flex flex-column justify-content-end">
                                    <CardTitle tag="h3" style={{ color: this.nameBackground }}>{this.eName || 'Oops! Event name is not there...input now'}</CardTitle>
                                    <div width="100%" className="clearfix">
                                        <img className="img-thumbnail float-left" src="https://placeholdit.imgix.net/~text?txtsize=11&txt=50%C3%9750&w=50&h=50&bg=fff&txtclr=333" alt="Card image cap" />
                                        <div className="d-flex flex-column pl-2">
                                            <small className="text-truncate mb-0" style={{ textColor: '#12FF6A' }} >{this.shortDec || 'this is short decription'} </small>
                                            <small className="text-body text-truncate mb-0"><Moment format="DD/MM/YYYY HH:mm">{this.startDate}</Moment> - <Moment format="DD/MM/YYYY HH:mm">{this.endDate}</Moment></small>
                                            <small className="text-muted text-truncate">@yourName</small>
                                        </div>
                                    </div>
                                </div>
                            </CardImgOverlay>
                        </Card>
                    </FormGroup>
                    <FormGroup className="text-area-content">
                        <Label for="shortDec">Short decription</Label>
                        <textarea className="text-area short" type="text" name="shortDec" placeholder="Limit 200 char" value={this.shortDec || ''} onChange={(e) => this.shortDec = e.target.value} />
                    </FormGroup>
                    <FormGroup className="text-area-content">
                        <Label for="fullDec">Full decription</Label>
                        <textarea className="text-area full" type="text" name="fullDec" placeholder="Limit 500 char" value={this.fullDec || ''} onChange={(e) => this.fullDec = e.target.value} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Location</Label>
                        <Input type="text" placeholder="Limit 100 char" value={this.location || ''} onChange={(e) => this.location = e.target.value} />
                    </FormGroup>
                    <FormGroup>
                        <Label>URL</Label>
                        <Input type="text" placeholder="Limit 100 char" value={this.url || ''} onChange={(e) => this.url = e.target.value} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Fee</Label>
                        <Input type="text" placeholder="Limit 50 char" value={this.fee || ''} onChange={(e) => this.fee = e.target.value} />
                    </FormGroup>
                    <Button type="submit">Submit</Button>
                </Form>
            </div>
        );
    }
}
export default CreateEventScreen