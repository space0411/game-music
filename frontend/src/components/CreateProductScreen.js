import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, FormControl, Select, MenuItem, FormHelperText,
    TextField, List, ListItem, ListItemText,
    ListItemSecondaryAction
} from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import AlertDialog from './dialog/AlertDialog';
import CKEditor from 'ckeditor4-react';


@inject('ScreenStore', 'SessionStore')
@observer
class CreateProductsScreen extends React.Component {
    @observable productData
    @observable isEditProductMode = false
    @observable categoriesList = []
    @observable selectedCate
    @observable selectedChildCate
    state = {
        cateName: '',
        cateChildName: ''
    };
    @observable alert = {
        title: 'Ops!',
        content: 'Please fill required information'
    }
    @observable open = false

    @observable name = ''
    @observable quantity = ''
    @observable price = ''
    @observable unit = ''
    @observable view
    @observable shortdetail = ''
    @observable fulldetail = ''
    @observable files = []
    @observable prevCate = ''

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('Products')
    }

    handleNewProductsClick = (e) => {
        e.preventDefault()
        if (!this.name || !this.quantity || !this.price || !this.unit || !this.selectedCate || !this.selectedChildCate) {
            this.open = true
            return
        }
        fetch(`${this.props.SessionStore.API_URL}product/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                name: this.name,
                quantity: this.quantity,
                price: this.price,
                unit: this.unit,
                view: 0,
                // createdBy: this.props.SessionStore.getUserID(),
                type: this.selectedCate.id,
                maintype: this.selectedChildCate.id,
                shortdetail: this.shortdetail,
                fulldetail: this.fulldetail
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Notify',
                content: jsonResult.message
            }
            this.open = true
            if (jsonResult.success)
                this.uploadImage(jsonResult.data.id)
        }).catch((error) => {
            console.error(error);
        });
    }

    handleUpdateProductsClick = (e) => {
        e.preventDefault()
        if (!this.productData || !this.name || !this.quantity || !this.price || !this.unit || !this.selectedCate || !this.selectedChildCate) {
            this.open = true
            return
        }
        fetch(`${this.props.SessionStore.API_URL}product/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({
                id: this.productData.id,
                name: this.name,
                quantity: this.quantity,
                price: this.price,
                unit: this.unit,
                view: 0,
                // createdBy: this.props.SessionStore.getUserID(),
                type: this.selectedCate.id,
                maintype: this.selectedChildCate.id,
                shortdetail: this.shortdetail,
                fulldetail: this.fulldetail
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Notify',
                content: jsonResult.message
            }
            this.open = true
            // if (jsonResult.success)
            //     this.uploadImage(jsonResult.data.id)
        }).catch((error) => {
            console.error(error);
        });
    }

    uploadImage = (productid) => {
        var data = new FormData()
        // for (const item of this.files) {
        //     data.append(`image`, item.file, item.name)
        // }
        this.files.forEach((item, index) => {
            data.append(`image${index}`, item.file, item.name)
        })
        fetch(`${this.props.SessionStore.API_URL}product/image?productid=${productid}&size=${this.files.length}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: data
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Notify',
                content: jsonResult.message
            }
            this.open = true
        }).catch((error) => {
            console.error(error);
        });
    }

    handleChange = event => {
        this.selectedCate = this.categoriesList[event.target.value]
        console.log(this.selectedCate);
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChildChange = event => {
        this.selectedChildCate = this.selectedCate.childlist[event.target.value]
        console.log(this.selectedChildCate);
        this.setState({ [event.target.name]: event.target.value });
    };

    handleFileChange = e => {
        console.log(e.target.value)
        if (e.target.value) {
            var value = e.target.value
            var files = e.target.files
            var self = this
            // var maxWidth = 600
            // var maxHeight = 400
            // this.resize(files[0], maxWidth, maxHeight, function (resizedDataUrl) {
            //     console.log(resizedDataUrl)
            //     self.files.push({ 'name': value, 'file': resizedDataUrl })
            //     self.files = self.files.slice()
            // });
            self.files.push({ 'name': value, 'file': files[0] })
            self.files = self.files.slice()
        }
    }

    handleFileDelete = index => {
        this.files.splice(index, 1);
    };

    handleClose = () => {
        this.open = false
    };

    onEditorShortChange = (evt) => {
        this.shortdetail = evt.editor.getData()
    }

    onEditorFullChange = (evt) => {
        this.fulldetail = evt.editor.getData()
    }

    handleRefeshCateClick = (e) => {
        e.preventDefault()
        this.handleGetCategory()
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AlertDialog handleOke={this.handleClose} handleClose={this.handleClose} data={this.alert} open={this.open} />
                <h5>Product information</h5>
                <FormControl className={classes.formControl}>
                    <Select
                        value={this.state.cateName}
                        onChange={this.handleChange}
                        name="cateName"
                        displayEmpty
                        className={classes.selectEmpty}
                    >
                        <MenuItem value="" disabled>
                            Main Categories
                        </MenuItem>
                        {
                            this.categoriesList.map((item, index) => (
                                <MenuItem key={index} value={index}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                    <FormHelperText>Select a main category</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Select
                        value={this.state.cateChildName}
                        onChange={this.handleChildChange}
                        name="cateChildName"
                        displayEmpty
                        className={classes.selectEmpty}
                    >
                        <MenuItem value="" disabled>
                            Content Categories
                        </MenuItem>
                        {this.selectedCate ?
                            this.selectedCate.childlist.map((item, index) => (
                                <MenuItem key={index} value={index}>{item.name}</MenuItem>
                            ))
                            :
                            null
                        }
                    </Select>
                    <FormHelperText>Select a content category</FormHelperText>
                </FormControl>
                <Button variant="contained" className={classes.button} onClick={this.handleRefeshCateClick} color="primary">Refesh Categories</Button>
                {this.isEditProductMode ? <h6>{this.prevCate}</h6> : null}
                <br></br>
                <TextField
                    required
                    label="Product Name"
                    className={classes.textField}
                    value={this.name}
                    onChange={event => this.name = event.target.value}
                    margin="normal" />
                <TextField
                    required
                    label="Quantity"
                    className={classes.textField}
                    value={this.quantity}
                    onChange={event => this.quantity = event.target.value}
                    margin="normal" />
                <br></br>
                <TextField
                    required
                    label="Price"
                    className={classes.textField}
                    value={this.price}
                    onChange={event => this.price = event.target.value}
                    margin="normal" />
                <TextField
                    required
                    label="Unit"
                    className={classes.textField}
                    value={this.unit}
                    onChange={event => this.unit = event.target.value}
                    margin="normal" />
                <br></br>
                <TextField
                    label="View"
                    className={classes.textField}
                    value={this.view}
                    onChange={event => this.view = event.target.value}
                    margin="normal"
                />
                <h5>Short Detail</h5>
                <CKEditor
                    data={this.shortdetail}
                    type="classic"
                    onChange={this.onEditorShortChange} />
                <br></br>
                <h5>Full Detail</h5>
                <CKEditor
                    data={this.fulldetail}
                    type="classic"
                    onChange={this.onEditorFullChange} />
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={this.handleFileChange}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span" className={classes.button}>
                        Select image
                    </Button>
                </label>
                <List dense className={classes.rootImageList}>
                    {this.files.map((item, index) => (
                        <ListItem key={index} button>
                            <ListItemText primary={item.name} />
                            <ListItemSecondaryAction>
                                <Clear onClick={() => this.handleFileDelete(index)} />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <br></br>
                <Button
                    variant="contained"
                    className={classes.button}
                    onClick={this.isEditProductMode ? this.handleUpdateProductsClick : this.handleNewProductsClick}
                    color="primary">
                    Submit
                </Button>
            </div>
        );
    }
    componentDidMount() {
        if (this.props.ScreenStore.isEditEventStage) {
            this.productData = this.props.ScreenStore.editEventData
            const productData = this.props.ScreenStore.editEventData
            // Set MODE EDIT
            this.isEditProductMode = true
            if (productData) {
                this.name = productData.name
                this.quantity = productData.quantity
                this.price = productData.price
                this.unit = productData.unit
                this.view = productData.view
                this.shortdetail = productData.shortdetail
                this.fulldetail = productData.fulldetail
                //this.files = []
            } else {
                console.log('Product data is null! Need back to prev page.')
            }
            this.props.ScreenStore.clearEditEventStage()
        }
        this.handleGetCategory()
    }

    handleGetCategory = () => {
        fetch(`${this.props.SessionStore.API_URL}categories/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.categoriesList = jsonResult.data.list
            this.setDefaultForEdit(jsonResult.data.list)
        }).catch((error) => {
            console.error(error);
        });
    }

    setDefaultForEdit(categoriesList) {
        if (this.props.ScreenStore.isEditEventStage) {
            const productData = this.props.ScreenStore.editEventData
            if (categoriesList.length > 0 && productData)
                console.log('error hfhf');
            categoriesList.some(value => {
                if (value.id === productData.maintype) {
                    const cateName = value.name
                    let cateChildName = ''
                    this.selectedCate = value
                    value.childlist.every(childValue => {
                        if (childValue.id === productData.type) {
                            cateChildName = childValue.name
                            this.selectedChildCate = childValue
                            this.prevCate = cateName + ' -> ' + cateChildName
                            return true
                        } else {
                            return false
                        }
                    })
                    return true
                } else {
                    return false
                }
            })
        }
        console.log('category', this.selectedCate);
        console.log('category child', this.selectedChildCate);
    }


    resize(file, maxWidth, maxHeight, fn) {
        var reader = new FileReader();
        var that = this
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            var dataUrl = event.target.result;

            var image = new Image();
            image.src = dataUrl;
            image.onload = function () {
                var resizedDataUrl = that.resizeImage(image, maxWidth, maxHeight, 0.7);
                fn(resizedDataUrl);
            };
        };
    }

    resizeImage(image, maxWidth, maxHeight, quality) {
        var canvas = document.createElement('canvas');

        var width = image.width;
        var height = image.height;

        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height * maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width * maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL("image/jpeg", quality);
    }
}

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    margin: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    rootImageList: {
        width: '100%',
        maxWidth: '50%',
        backgroundColor: theme.palette.background.paper,
    }
});
CreateProductsScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateProductsScreen);
