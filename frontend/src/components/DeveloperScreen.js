import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TablePagination, TableRow,
    Paper, Checkbox, IconButton
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import EnhancedTableHead from './table/EnhancedTableHead';
import EnhancedTableToolbar from './table/EnhancedTableToolbar';
import AlertDialog from './dialog/AlertDialog';
import EditDialog from './dialog/EditDialog';
import { HeadStyle } from './table/HeadKey';


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
});


@inject('ScreenStore', 'SessionStore')
@observer
class DeveloperScreen extends React.Component {
    screenName = 'Developer'
    @observable data = []
    @observable totalRows = 0
    @observable openAlert = false
    @observable openEditAlert = false
    @observable productId
    @observable alert = {
        title: 'Alert',
        content: 'Do you want delete ?'
    }

    @observable alertEdit = {
        title: 'Edit',
        content: 'Fill a name for edit'
    }

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle(this.screenName)
    }

    state = {
        order: 'desc',
        orderBy: 'id',
        selected: [],
        page: 0,
        rowsPerPage: 20,
    };

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
        this.alertEdit = { ...this.alertEdit, ...item }
        this.openEditAlert = true
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

    handleEditAlertClose = () => {
        this.openEditAlert = false
    }

    handleAgreeDelete = () => {
        this.openAlert = false
        this.delete(this.productId)
    }

    handleAgreeEdit = (item) => {
        console.log('Edit data', item)
        this.openEditAlert = false
        this.edit(item.name, item.id, item.url)
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

    render() {
        const { classes } = this.props;
        const data = this.data;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.totalRows - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <AlertDialog handleAgree={this.handleAgreeDelete} handleDisagree={this.handleAlertClose} handleClose={this.handleAlertClose} data={this.alert} open={this.openAlert} />
                <EditDialog handleClose={this.handleEditAlertClose} handleAgree={this.handleAgreeEdit} data={this.alertEdit} open={this.openEditAlert} />
                <EnhancedTableToolbar numSelected={selected.length} handleDeleteMultiItem={this.handleDeleteMultiItem} toolbarName={this.screenName} handleSearch={this.handleSearch} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            headStyle={HeadStyle.Developer}
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
                                            <TableCell component="th" scope="row" padding="none">{n.image}</TableCell>
                                            <TableCell component="th" scope="row" padding="none">{n.url}</TableCell>
                                            <TableCell align="right">
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                    <IconButton onClick={() => this.handleEditClick(n)} color="primary" className={classes.button} aria-label="Edit">
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton onClick={() => this.handleDeleteClick(n)} color="secondary" className={classes.button} aria-label="Delete">
                                                        <Delete />
                                                    </IconButton>
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

    componentDidMount() {
        this.get(undefined, this.state.page)
    }

    get(searchText, page, isClearSearch) {
        const data = {
            page: page + 1,
            rowsOnPage: this.state.rowsPerPage,
            searchName: searchText
        }
        if (!searchText)
            delete data.searchName
        fetch(`${this.props.SessionStore.API_URL}developer/read`, {
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

    edit(name, id, url) {
        fetch(`${this.props.SessionStore.API_URL}developer/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                id: id,
                name: name,
                url: url
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.data = this.data.map(value => value.id === id ? jsonResult.data : value)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(productId) {
        fetch(`${this.props.SessionStore.API_URL}developer/delete`, {
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
                if (typeof productId === 'number') {
                    this.data = this.data.filter(item => item.id !== productId)
                } else {
                    this.data = this.data.filter(e => !productId.includes(e.id));
                    this.setState({ selected: [] })
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}

DeveloperScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeveloperScreen);
