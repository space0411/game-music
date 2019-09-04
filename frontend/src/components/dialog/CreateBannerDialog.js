import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

@inject('SessionStore')
@observer
class CreateBannerDialog extends React.Component {
    @observable products = []
    @observable title = ''
    @observable content = ''
    @observable selectedProductId = ''
    @observable openSelect = false

    handleChangeTitle = (e) => {
        this.title = e.target.value
    }

    handleChangeContent = (e) => {
        this.content = e.target.value
    }

    handleApplyChange = (data) => {
        if (data.name.length < 1) {
            return
        }
        this.props.handleAgree(data)
        this.setState({ name: '', url: '' })
    }

    handleSearch = (e) => {
        const searchText = e.target.value
        if (searchText.length > 3)
            this.getProducts(searchText)
        if (searchText.length === 0)
            this.getProducts()
    }

    handleChangeProduct = (event) => {
        this.selectedProductId = event.target.value
    }

    handleCloseSelect = () => {
        this.openSelect = false
    }

    handleOpenSelect = () => {
        this.openSelect = true
    }

    render() {
        const { classes, handleClose, data, open } = this.props
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Create Banner</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">

                    </DialogContentText>
                    <TextField
                        required
                        label='Title'
                        className={classes.textField}
                        value={this.title}
                        onChange={this.handleChangeTitle}
                        margin="normal" />
                    <TextField
                        required
                        label='Content'
                        className={classes.textField}
                        value={this.content}
                        onChange={this.handleChangeContent}
                        margin="normal" />
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            onChange={this.handleSearch}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="name">Product</InputLabel>
                        <Select
                            open={this.openSelect}
                            onClose={this.handleCloseSelect}
                            onOpen={this.handleOpenSelect}
                            value={this.selectedProductId}
                            onChange={this.handleChangeProduct}
                            inputProps={{
                                name: 'name',
                                id: 'id',
                            }}
                        >
                            {
                                this.products.map((value, index) => <MenuItem key={index} value={value.id}>{value.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button onClick={() => this.handleApplyChange(data)} color="primary">Apply</Button>
                        <Button onClick={handleClose} color="primary" autoFocus>Close</Button>
                    </div>
                </DialogActions>
            </Dialog>
        );
    }

    getProducts(searchText) {
        const data = {
            page: this.active,
            rowsOnPage: 20,
            searchName: searchText
        }
        if (!searchText)
            delete data.searchName
        fetch(`${this.props.SessionStore.API_URL}product/read`, {
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
                this.products = jsonResult.data.list
                this.handleOpenSelect()
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.10),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.15),
        },
        marginTop: 10,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
    formControl: {
        width: '100%',
        marginLeft: 10,
        minWidth: 120,
    },
})

CreateBannerDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

export default withStyles(styles)(CreateBannerDialog);
