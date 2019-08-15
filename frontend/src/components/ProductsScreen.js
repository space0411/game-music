import React from 'react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TablePagination, TableRow,
    Paper, Checkbox, IconButton
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Delete, Edit } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import Moment from 'react-moment';

import EnhancedTableHead from './table/EnhancedTableHead';
import EnhancedTableToolbar from './table/EnhancedTableToolbar';
import AlertDialog from './dialog/AlertDialog';
import { HeadStyle } from './table/HeadKey';

const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})(props => <Checkbox color="default" {...props} />);

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
class ProductsScreen extends React.Component {
    screenName = 'Products'
    @observable data = []
    @observable openAlert = false
    @observable productId
    @observable alert = {
        title: 'Alert',
        content: 'Do you want delete ?'
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
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleEditClick = (item) => {
        this.props.ScreenStore.setEditEventStage(true, item)
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
        this.deleteProducts(this.productId)
    }

    render() {
        if (this.props.ScreenStore.isEditEventStage) {
            return <Redirect to='/edit-product' />
        }
        const { classes } = this.props;
        const data = this.data;
        const { order, orderBy, selected, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <AlertDialog handleAgree={this.handleAgreeDelete} handleDisagree={this.handleAlertClose} handleClose={this.handleAlertClose} data={this.alert} open={this.openAlert} />
                <EnhancedTableToolbar numSelected={selected.length} toolbarName={this.screenName} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            headStyle={HeadStyle.Product}
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
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.name}
                                            </TableCell>
                                            <TableCell align="right">{n.idGame}</TableCell>
                                            <TableCell align="right"><Moment format="D MMM YYYY" unix>{n.releaseDate}</Moment></TableCell>
                                            <TableCell align="right">{n.createdBy}</TableCell>
                                            <TableCell align="right">{n.numberOfFile}</TableCell>
                                            <TableCell align="right">{n.view}</TableCell>
                                            <TableCell padding="checkbox"><GreenCheckbox checked={n.publish} /></TableCell>
                                            <TableCell align="right">
                                                <div className="d-flex flex-row">
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
                    rowsPerPageOptions={[10, 20, 40]}
                    component="div"
                    count={data.length}
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
        this.getProducts()
    }

    getProducts() {
        fetch(`${this.props.SessionStore.API_URL}product/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                page: this.active,
                rowsOnPage: 20
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.data = jsonResult.data.list
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    deleteProducts(productId) {
        fetch(`${this.props.SessionStore.API_URL}product/delete`, {
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
                this.data = this.data.filter(item => item.id !== productId)
                this.handleClick(undefined, productId)
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}

ProductsScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductsScreen);
