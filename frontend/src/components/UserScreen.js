import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import ItemUser from './contents/ItemUser';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

@inject('ScreenStore', 'SessionStore')
@observer
class UserScreen extends Component {

    @observable page = 1
    @observable listUsers = []
    @observable isSuccess = false
    // Role
    @observable isOpenFilterRole = false
    @observable roleSelected = 'all'
    @observable roleFilter = ['all', 'admin', 'user']

    //Paging
    @observable numberstart = 1;
    @observable numberend = 0;
    @observable active = 1;
    @observable pagerow = [];

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('All User')
        this.handleItemSelection = this.handleItemSelection.bind(this)
    }

    handleItemSelection(item) {
        console.log(item)
    }

    componentDidMount() {
        this.getUser()
    }

    onChangePage = (pageNumber) => {
        if (this.active !== pageNumber) {
            this.active = pageNumber;
            this.getUser()
        }
    }

    render() {
        let items = []
        for (let number = this.numberstart; number <= this.numberend; number++) {
            items.push(
                <PaginationItem key={number} active={number === this.active} onClick={() => this.onChangePage(number)}>
                    <PaginationLink>
                        {number}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
        return (
            <div id="container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" style={{ width: '5%' }} className="text-center">#</th>
                            <th scope="col" style={{ width: '5%' }} className="text-center">ID</th>
                            <th scope="col" style={{ width: '10%' }} className="text-center">
                                <Dropdown isOpen={this.isOpenFilterRole} toggle={this.toggleRoleFilter}>
                                    <DropdownToggle outline color="primary" size="sm">
                                        Role {this.roleSelected}
                                    </DropdownToggle>
                                    <DropdownMenu>{
                                        this.roleFilter.map((item, index) =>
                                            <DropdownItem key={index} onClick={() => this.roleSelected = item}>{item}</DropdownItem>
                                        )}
                                    </DropdownMenu>
                                </Dropdown></th>
                            <th scope="col" style={{ width: '20%' }} className="text-center">UserName</th>
                            <th scope="col" style={{ width: '15%' }} className="text-center">Name</th>
                            <th scope="col" style={{ width: '10%' }} className="text-center">Phone</th>
                            <th scope="col" style={{ width: '20%' }} className="text-center">Address</th>
                            <th scope="col" style={{ width: '15%' }} className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>{
                        this.listUsers.map((item, idx) => {
                            if (item.role !== this.roleSelected && this.roleSelected !== 'all') {
                                return null;
                            }
                            return <ItemUser key={idx} data={item} index={idx} />
                        })}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center">
                    <Pagination className="mt-2">
                        <PaginationItem>
                            <PaginationLink previous disabled={this.active === 1} onClick={this.OnPrevPage} />
                        </PaginationItem>
                        {items}
                        <PaginationItem>
                            <PaginationLink next disabled={this.active === this.maxpage} onClick={this.onNextPage} />
                        </PaginationItem>
                    </Pagination>
                </div>
            </div>
        );
    }

    toggleRoleFilter = () => {
        this.isOpenFilterRole = !this.isOpenFilterRole
    }

    getUser() {
        fetch(`${this.props.SessionStore.API_URL}user/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                page: this.active,
                rowsOnPage: 20
            })
        })
            .then((result) => {
                return result.json();
            }).then((jsonResult) => {
                console.log(jsonResult);
                if (jsonResult.success) {
                    this.listUsers = jsonResult.data.list
                    this.isSuccess = true
                    this.pagging(jsonResult.data.totalRows)
                } else {
                    this.isSuccess = false
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    onNextPage = () => {
        if (this.active === this.numberend && this.numberend !== this.maxpage) {
            this.numberend += 1;
            this.numberstart += 1;
            this.active += 1;
        }
        else
            this.active += 1;
        this.getUser()
    }
    OnPrevPage = () => {
        if (this.active === this.numberstart && this.numberstart !== 1) {
            this.active -= 1;
            this.numberend -= 1;
            this.numberstart -= 1;
        }
        else
            this.active -= 1;
        this.getUser()
    }

    pagging(size) {
        // Paging
        //let size = jsonResult.data.totalRows;
        if (size % 20 !== 0) {
            this.maxpage = parseInt(size / 20) + 1;
        } else {
            this.maxpage = size / 20;
        }
        if (this.maxpage <= 5) {
            this.numberend = this.maxpage;;
        } else {
            if (this.active > this.numberstart && this.active < this.numberend) {

            } else {
                if (this.active + 4 > this.maxpage) {
                    this.numberend = this.maxpage;
                    if (this.active - 4 < 1)
                        this.numberstart = 1;
                    else {
                        if (this.numberend - (this.active - 4) > 5)
                            this.numberstart = this.numberend - 4;
                        else
                            this.numberstart = this.active - 4;

                    }
                } else {
                    this.numberend = this.active === 1 ? this.active + 4 : this.active + 3;
                    this.numberstart = this.active === 1 ? this.active : this.active - 1;
                }
            }
        }
    }
}
const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
});

UserScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UserScreen)