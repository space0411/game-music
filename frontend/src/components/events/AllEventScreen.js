import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import '../css/AllEvent.css';
import { observable } from 'mobx';
import ItemEvent from '../contents/ItemEvent';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';


@inject('ScreenStore', 'SessionStore')
@observer
class AllEventScreen extends Component {

    @observable page = 1
    @observable listEvents = []
    @observable isSuccess = false

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('All Event')
        this.handleItemSelection = this.handleItemSelection.bind(this)
    }

    handleItemSelection(item) {
        console.log(item)
    }

    componentDidMount() {
        fetch(`${this.props.SessionStore.API_URL}event/all?page=${this.page}`, {
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
                            <th scope="col" className="text-center">#</th>
                            <th scope="col" className="text-center">ID</th>
                            <th scope="col" className="text-center">Event Type</th>
                            <th scope="col" className="text-center">Client ID</th>
                            <th scope="col">Name</th>
                            <th scope="col" className="text-center">Date</th>
                            <th scope="col" className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.listEvents.map((data, idx) => {
                            return <ItemEvent key={idx} eventData={data} index={idx} />
                        })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center">
                    <Pagination aria-label="Page navigation example">
                        <PaginationItem>
                            <PaginationLink previous href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                                1
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                                3
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                                4
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">
                                5
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink next href="#" />
                        </PaginationItem>
                    </Pagination>
                </div>
            </div>
        );
    }
}
export default AllEventScreen