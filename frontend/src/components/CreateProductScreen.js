import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Button, FormControl, Select, MenuItem, FormHelperText,
    TextField, Checkbox, FormControlLabel, IconButton,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { Delete, QueueMusic, Refresh } from '@material-ui/icons';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import AlertDialog from './dialog/AlertDialog';
import CKEditor from 'ckeditor4-react';
import CreateCategories from './CreateCategories';
import Moment from 'moment';
import MusicDialog from './dialog/MusicDialog';
import MusicManagerDialog from './dialog/MusicManagerDialog';
import Title from './custom/Title';

const ImageType = {
    COVER: 0,
    BANNER: 1
}

@inject('ScreenStore', 'SessionStore')
@observer
class CreateProductsScreen extends React.Component {
    @observable productData
    @observable isEditProductMode = false
    @observable categoriesList = []
    @observable selectedCate
    state = {
        cateName: '',
        cateChildName: ''
    };
    @observable alert = {
        title: 'Ops!',
        content: 'Please fill required information'
    }
    @observable alertRemoveImage = {
        title: 'Alert',
        content: 'Do you want remove image?'
    }
    @observable openAlert = false
    @observable openRemoveImageAlert = false
    @observable openAlertFlatformGenre = false
    @observable openUploadMusic = false
    @observable openMusic = false
    @observable selectedImage

    @observable name = ''
    @observable numberOfFile = 0
    @observable view = 0
    @observable shortDetail = ''
    @observable fullDetail = ''
    @observable files = []
    @observable filesLive = []
    @observable prevCate = ''
    @observable selectedDate = new Date()
    @observable isPublish = true

    constructor(props) {
        super(props);
        this.props.ScreenStore.setTitle('Products')
    }

    handleNewProductsClick = (e) => {
        e.preventDefault()
        if (!this.name || !this.selectedCate) {
            this.openAlert = true
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
                numberOfFile: this.numberOfFile,
                releaseDate: Moment(this.selectedDate).unix(),
                view: this.view,
                idGame: this.selectedCate.id,
                shortDetail: this.shortDetail,
                fullDetail: this.fullDetail,
                publish: this.isPublish
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Notify',
                content: jsonResult.message
            }
            this.openAlert = true
            if (jsonResult.success)
                this.uploadImage(jsonResult.data.id)
        }).catch((error) => {
            console.error(error);
        });
    }

    handleUpdateProductsClick = (e) => {
        e.preventDefault()
        if (!this.productData || !this.name || !this.selectedCate) {
            this.openAlert = true
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
                numberOfFile: this.numberOfFile,
                releaseDate: Moment(this.selectedDate).unix(),
                view: this.view,
                idGame: this.selectedCate.id,
                shortDetail: this.shortDetail,
                fullDetail: this.fullDetail,
                publish: this.isPublish
            })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            this.alert = {
                title: 'Notify',
                content: jsonResult.message
            }
            this.openAlert = true
            if (jsonResult.success && this.files.length > 0)
                this.uploadImage(jsonResult.data.id)
        }).catch((error) => {
            console.error(error);
        });
    }

    uploadImage = (productid) => {
        var types = []
        var data = new FormData()
        this.files.forEach(item => {
            data.append('image', item.file)
            types.push(item.type)
        })
        fetch(`${this.props.SessionStore.API_URL}product/image?id=${productid}&types=${JSON.stringify(types)}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: data
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            const alert = {
                title: 'Notify',
                content: jsonResult.message
            }
            this.openAlertDialog(alert)
        }).catch((error) => {
            console.error(error);
        });
    }

    openAlertDialog = (alert) => {
        this.alert = alert
        this.openAlert = true
    }

    handleChange = event => {
        this.selectedCate = this.categoriesList[event.target.value]
        console.log(this.selectedCate);
        this.setState({ [event.target.name]: event.target.value });
    };

    handleFileCover = e => {
        console.log(e.target.value)
        if (e.target.value) {
            // var value = e.target.value
            var files = e.target.files
            var self = this
            // var maxWidth = 600
            // var maxHeight = 400
            // this.resize(files[0], maxWidth, maxHeight, function (resizedDataUrl) {
            //     console.log(resizedDataUrl)
            //     self.files.push({ 'name': value, 'file': resizedDataUrl })
            //     self.files = self.files.slice()
            // });
            self.files.push({ 'name': files[0].name, 'file': files[0], 'type': ImageType.COVER })
            self.files = self.files.slice()
        }
    }

    handleFileBanner = e => {
        console.log(e.target.value)
        if (e.target.value) {
            var files = e.target.files
            this.files.push({ 'name': files[0].name, 'file': files[0], 'type': ImageType.BANNER })
            this.files = this.files.slice()
        }
    }

    handleFileDelete = index => {
        this.files.splice(index, 1);
    };

    handleClose = () => {
        this.openAlert = false
        this.openRemoveImageAlert = false
        this.openUploadMusic = false
        this.openMusic = false
    };

    onEditorShortChange = (evt) => {
        this.shortDetail = evt.editor.getData()
    }

    onEditorFullChange = (evt) => {
        this.fullDetail = evt.editor.getData()
    }

    handleRefeshCateClick = (e) => {
        e.preventDefault()
        this.handleGetCategory()
    }

    handleNewFlatformGenre = (e) => {
        e.preventDefault()
        this.openAlertFlatformGenre = true
    }

    handleCloseCreateFlatformGenre = () => {
        this.openAlertFlatformGenre = false
    }

    handleDateChange = (date) => {
        this.selectedDate = date
    }

    handlePublishChange = () => {
        this.isPublish = !this.isPublish
    }

    handleRemoveImage = () => {
        this.deleteImage(this.selectedImage)
    }

    handleRemoveLiveImage = (item) => {
        this.openRemoveImageAlert = true
        this.selectedImage = item
        console.log(this.selectedImage)
    }

    handleOpenUploadMusicDialog = () => {
        this.openUploadMusic = true
    }

    handleOpenMusicDialog = () => {
        this.openMusic = true
    }

    render() {
        const { classes } = this.props;
        const { getProductImage } = this.props.SessionStore
        return (
            <div>
                <CreateCategories
                    open={this.openAlertFlatformGenre}
                    handleClose={this.handleCloseCreateFlatformGenre} />
                <MusicDialog
                    open={this.openUploadMusic}
                    handleClose={this.handleClose}
                    openAlertDialog={this.openAlertDialog}
                    productData={this.productData} />
                <MusicManagerDialog
                    open={this.openMusic}
                    handleClose={this.handleClose}
                    openAlertDialog={this.openAlertDialog} />
                <AlertDialog
                    open={this.openAlert}
                    handleOke={this.handleClose}
                    handleClose={this.handleClose}
                    data={this.alert} />
                <AlertDialog
                    open={this.openRemoveImageAlert}
                    handleDisagree={this.handleClose}
                    handleAgree={this.handleRemoveImage}
                    handleClose={this.handleClose}
                    data={this.alertRemoveImage} />
                <Title text='Product information' />
                <Button variant="contained" className={classes.button} onClick={this.handleNewFlatformGenre} color="primary">New Flatform & Genre</Button>
                {
                    this.isEditProductMode &&
                    <>
                        <Button variant="contained" className={classes.button} onClick={this.handleOpenUploadMusicDialog} color="secondary">
                            Upload Music<QueueMusic className={classes.rightIcon} />
                        </Button>
                        <Button variant="contained" className={classes.button} onClick={this.handleOpenMusicDialog} color="secondary">
                            Music<QueueMusic className={classes.rightIcon} />
                        </Button>
                    </>
                }
                <br></br>
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
                <IconButton variant="contained" className={classes.button} onClick={this.handleRefeshCateClick} color="primary"><Refresh className={classes.rightIcon} /></IconButton>
                {this.isEditProductMode && <div style={{ marginLeft: 6 }}>Selected:<h6>{this.prevCate}</h6></div>}
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
                <br></br>
                <TextField
                    required
                    label="Product Name"
                    className={classes.textFieldName}
                    value={this.name}
                    onChange={event => this.name = event.target.value}
                    margin="normal" />
                <br></br>
                <TextField
                    label="Number Of File"
                    type="number"
                    className={classes.textField}
                    value={this.numberOfFile}
                    onChange={event => this.numberOfFile = event.target.value}
                    margin="normal" />
                <TextField
                    label="View"
                    type="number"
                    className={classes.textField}
                    value={this.view}
                    onChange={event => this.view = event.target.value}
                    margin="normal"
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        id="mui-pickers-date"
                        label="Release Date"
                        value={this.selectedDate}
                        onChange={this.handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <br></br>
                <Title text='Image & Cover' />
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file-cover"
                    multiple
                    type="file"
                    onChange={this.handleFileCover}
                />
                <label htmlFor="contained-button-file-cover">
                    <Button variant="contained" component="span" className={classes.button}>
                        Select cover image (4x4)
                    </Button>
                </label>
                <input
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file-banner"
                    multiple
                    type="file"
                    onChange={this.handleFileBanner}
                />
                <label htmlFor="contained-button-file-banner">
                    <Button variant="contained" component="span" className={classes.button}>
                        Select banner image (8x4)
                    </Button>
                </label>
                <br></br>
                {this.files.length > 0 &&
                    <div>Local image
                    {this.ImageGallery(classes, this.files, this.handleFileDelete, undefined)}
                    </div>
                }
                <br></br>
                {this.isEditProductMode &&
                    <div>Live image:
                        {
                            this.ImageGallery(classes, this.filesLive, this.handleRemoveLiveImage, getProductImage)
                        }
                    </div>
                }
                <Title text='More info' />
                <div>Short Detail</div>
                <CKEditor
                    data={this.shortDetail}
                    type="classic"
                    onChange={this.onEditorShortChange} />
                <br></br>
                <div>Full Detail</div>
                <CKEditor
                    data={this.fullDetail}
                    type="classic"
                    onChange={this.onEditorFullChange} />
                <br></br>
                <Button
                    variant="contained"
                    className={classes.button}
                    onClick={this.isEditProductMode ? this.handleUpdateProductsClick : this.handleNewProductsClick}
                    color="primary">
                    Submit
                </Button>
            </div >
        );
    }

    ImageGallery = (classes, files, onClickHandle, getProductImage) => {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {files.map((item, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <div style={{
                            backgroundImage: getProductImage ? `url(${getProductImage(item.url)})` : `url(${URL.createObjectURL(item.file)})`,
                            width: item.type === ImageType.BANNER ? 400 : 200,
                            height: 200,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            positions: 'relative'
                        }} />
                        <div>{item.type === ImageType.BANNER ? 'Banner' : 'Cover'}</div>
                        <IconButton className={classes.button} aria-label="delete" onClick={() => getProductImage ? onClickHandle(item) : onClickHandle(index)}>
                            <Delete />
                        </IconButton>
                    </div>
                ))}
            </div>
        )
    }

    componentDidMount() {
        if (this.props.ScreenStore.isEditEventStage) {
            this.productData = this.props.ScreenStore.editEventData
            const productData = this.props.ScreenStore.editEventData
            // Set MODE EDIT
            this.isEditProductMode = true
            if (productData) {
                this.name = productData.name
                this.numberOfFile = productData.numberOfFile
                this.releaseDate = productData.releaseDate
                this.view = productData.view
                this.shortDetail = productData.shortDetail
                this.fullDetail = productData.fullDetail
                this.publish = productData.publish
                this.filesLive = productData.images
                //this.files = []
            } else {
                console.log('Product data is null! Need back to prev page.')
            }
        }
        this.handleGetCategory()
    }

    handleGetCategory = () => {
        fetch(`${this.props.SessionStore.API_URL}game/read`, {
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

    deleteImage = (item) => {
        fetch(`${this.props.SessionStore.API_URL}product/removeimage`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({ id: item.id, url: item.url })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.filesLive = this.filesLive.filter(value => value.id !== item.id)
            }
            this.openRemoveImageAlert = false
            this.selectedImage = undefined
        }).catch((error) => {
            console.error(error);
            this.openRemoveImageAlert = false
            this.selectedImage = undefined
        });
    }

    setDefaultForEdit(categoriesList) {
        if (this.props.ScreenStore.isEditEventStage) {
            const productData = this.props.ScreenStore.editEventData
            if (categoriesList.length > 0 && productData)
                categoriesList.some(value => {
                    if (value.id === productData.idGame) {
                        const cateName = value.name
                        this.selectedCate = value
                        this.prevCate = cateName
                        return true
                    } else {
                        return false
                    }
                })
            // clear Edit Data ScreenStore
            this.props.ScreenStore.clearEditEventStage()
        }
        console.log('category', this.selectedCate);
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
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    textFieldName: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 350,
    },
    margin: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    rootImageList: {
        width: 'fit-content',
        backgroundColor: theme.palette.background.paper,
    }
});
CreateProductsScreen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateProductsScreen);
