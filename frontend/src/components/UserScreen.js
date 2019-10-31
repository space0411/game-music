import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import {
    Table, TableBody, TableCell, TablePagination, TableRow,
    Paper, Checkbox, IconButton, Tooltip
} from '@material-ui/core';
import { Delete, Edit, SettingsBackupRestore } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { HeadStyle } from './table/HeadKey';
import EnhancedTableHead from './table/EnhancedTableHead';
import EnhancedTableToolbar from './table/EnhancedTableToolbar';
import AlertDialog from './dialog/AlertDialog';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

@inject('ScreenStore', 'SessionStore')
@observer
class UserScreen extends Component {
    screenName = 'User'
    @observable data = []
    @observable totalRows = 0
    @observable openAlert = false
    @observable productId
    @observable alert = {
        title: 'Alert',
        content: 'Do you want delete ?'
    }

    state = {
        order: 'desc',
        orderBy: 'id',
        selected: [],
        page: 0,
        rowsPerPage: 20,
    };

    componentDidMount() {
        this.get(undefined, this.state.page)
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: this.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
        let item
        const index = page * this.state.rowsPerPage + 1
        if (index < this.data.length)
            item = this.data[index]
        if (this.totalRows > this.data.length && !item) {
            this.get(undefined, page)
        }
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleEditClick = (item) => {
        this.props.ScreenStore.setEditEventStage(item)
    }

    handleDeleteClick = (item) => {
        this.alert = {
            title: 'Alert',
            content: `Do you want delete product "${item.name}" with id=${item.id} ?`
        }
        this.productId = item.id
        this.openAlert = true
    }

    handleAlertClose = () => {
        this.openAlert = false
    }

    handleAgreeDelete = () => {
        this.openAlert = false
        this.delete(this.productId)
    }

    handleSearch = (searchText) => {
        if (searchText.length > 3) {
            this.setState({ page: 0 });
            this.get(searchText)
        }
        if (searchText.length === 0)
            this.get(undefined, this.state.page, true)
    }

    handleDeleteMultiItem = () => {
        console.log(this.state.selected);
        if (this.state.selected && this.state.selected.length > 0) {
            this.alert = {
                title: 'Alert',
                content: `Do you want delete "${this.state.selected.length}" product with id=${this.state.selected.toString()} ?`
            }
            this.productId = this.state.selected
            this.openAlert = true
        }
    }

    handleRevivalClick = (item) => {
        this.revivalUser(item.id)
    }

    render() {
        if (this.props.ScreenStore.isEditEventStage) {
            return <Redirect to='new-edit-user' />
        }
        const { classes } = this.props;
        const data = this.data;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.totalRows - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <AlertDialog handleAgree={this.handleAgreeDelete} handleDisagree={this.handleAlertClose} handleClose={this.handleAlertClose} data={this.alert} open={this.openAlert} />
                <EnhancedTableToolbar numSelected={selected.length} handleDeleteMultiItem={this.handleDeleteMultiItem} toolbarName={this.screenName} handleSearch={this.handleSearch} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            headStyle={HeadStyle.User}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    return (
                                        <TableRow
                                            hover
                                            // onClick={event => this.handleClick(event, n.id)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n.id}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox onChange={() => this.handleClick(undefined, n.id)} checked={isSelected} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">{n.id}</TableCell>
                                            <TableCell component="th" scope="row" padding="none">{n.name}</TableCell>
                                            <TableCell component="th" scope="row" padding="none">{n.role}</TableCell>
                                            <TableCell component="th" scope="row" padding="none">{n.email}</TableCell>
                                            <TableCell component="th" scope="row" padding="none">{n.phone}</TableCell>
                                            <TableCell component="th" scope="row" padding="none"><Moment format="D MMM YYYY hh:mm">{moment(n.createdAt)}</Moment></TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {
                                                    n.deletedAt !== 0 &&
                                                    <div>
                                                        <Moment format="D MMM YYYY hh:mm">{moment(n.deletedAt)}</Moment>
                                                        <Tooltip title="Revival">
                                                            <IconButton onClick={() => this.handleRevivalClick(n)} color="primary" className={classes.button} aria-label="Revival">
                                                                <SettingsBackupRestore />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            </TableCell>
                                            <TableCell align="right">
                                                <div style={styles.control}>
                                                    <Tooltip title="Edit">
                                                        <IconButton onClick={() => this.handleEditClick(n)} color="primary" className={classes.button} aria-label="Edit">
                                                            <Edit />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={() => this.handleDeleteClick(n)} color="secondary" className={classes.button} aria-label="Delete">
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[20]}
                    component="div"
                    count={this.totalRows}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }

    get(searchText, page, isClearSearch) {
        console.log(searchText);
        const data = {
            page: page + 1,
            rowsOnPage: this.state.rowsPerPage,
            searchName: searchText
        }
        if (!searchText)
            delete data.searchName
        fetch(`${this.props.SessionStore.API_URL}user/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify(data)
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                if (searchText || isClearSearch)
                    this.data = jsonResult.data.list
                else
                    this.data = [...this.data, ...jsonResult.data.list]
                this.totalRows = jsonResult.data.totalRows
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(productId) {
        fetch(`${this.props.SessionStore.API_URL}user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                id: productId
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                if (typeof productId !== 'number') {
                    this.setState({ selected: [] })
                }
                const resData = jsonResult.data
                if (resData) {
                    const tempData = [...this.data]
                    resData.forEach(value => {
                        const index = tempData.findIndex(item => value.id === item.id)
                        if (index !== -1) {
                            tempData.splice(index, 1, value)
                        }
                    })
                    this.data = tempData
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    revivalUser(id) {
        fetch(`${this.props.SessionStore.API_URL}user/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                id: id,
                deletedAt: 0
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                const index = this.data.findIndex(value => value.id === id)
                if (index !== -1) {
                    this.data.splice(index, 1, jsonResult.data)
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    control: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }
});

UserScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(UserScreen)