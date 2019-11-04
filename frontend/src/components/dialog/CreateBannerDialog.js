import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField,
    FormControlLabel, Checkbox
} from '@material-ui/core';
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
    @observable isPublish = false
    @observable openSelect = false
    @observable message = ''
    @observable bannerData
    @observable isEditMode = false

    componentWillReceiveProps(nextProps) {
        const data = nextProps.data
        if (data) {
            this.bannerData = data
            this.isEditMode = true
            this.title = data.title
            this.content = data.content
            this.selectedProductId = data.products.id
            this.products = []
            this.products = [...this.products, data.products]
            this.isPublish = data.publish
            this.message = `Edit banner with ID - ${data.id}`
        } else {
            this.bannerData = undefined
            this.isEditMode = false
            this.title = ''
            this.content = ''
            this.selectedProductId = ''
            this.products = []
            this.isPublish = false
            this.message = ''
        }
    }

    handleChangeTitle = (e) => {
        this.title = e.target.value
    }

    handleChangeContent = (e) => {
        this.content = e.target.value
    }

    handleCreateBanner = () => {
        if (this.title.length === 0 || this.content.length === 0 || this.selectedProductId === '') {
            this.message = 'Please fill all information'
            return
        }
        const data = {
            idProduct: this.selectedProductId,
            title: this.title,
            content: this.content,
            publish: this.isPublish
        }
        console.log('Create Banner with data:', this.title, this.content, this.selectedProductId)
        fetch(`${this.props.SessionStore.API_URL}banner/create`, {
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
                this.props.handleAddNewRow(jsonResult.data)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    handleEditBanner = () => {
        if (this.title.length === 0 || this.content.length === 0 || this.selectedProductId === '') {
            this.message = 'Please fill all information'
            return
        }
        const data = {
            id: this.bannerData.id,
            idProduct: this.selectedProductId,
            title: this.title,
            content: this.content,
            publish: this.isPublish
        }
        console.log('Edit Banner with data:', this.title, this.content, this.selectedProductId)
        fetch(`${this.props.SessionStore.API_URL}banner/update`, {
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
                this.props.handleEditRow(jsonResult.data)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    handleSearch = (e) => {
        const searchText = e.target.value
        if (searchText.length > 3)
            this.getProducts(searchText)
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

    handlePublishChange = () => {
        this.isPublish = !this.isPublish
    }

    render() {
        const { classes, handleClose, open } = this.props
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Create/update Banner</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.message}
                    </DialogContentText>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.isPublish}
                                onChange={this.handlePublishChange}
                                value="Publish"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                        }
                        label="Publish"
                        style={{ marginLeft: 1, marginTop: 5 }}
                    />
                </DialogContent>
                <DialogActions>
                    <div>
                        <Button onClick={this.isEditMode ? this.handleEditBanner : this.handleCreateBanner} color="primary">Submit</Button>
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
        width: 350,
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
        width: '80%',
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
