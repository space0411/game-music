import React from 'react';

import {
    Button, Dialog, DialogActions, DialogContent,
    TextField, DialogTitle, AppBar, Tabs, Tab,
    Typography, Toolbar, Slide, List, ListItem,
    ListItemIcon, IconButton, ListItemText, Checkbox,
    ListItemSecondaryAction, Radio
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import GameIcon from '@material-ui/icons/Games';
import StyleIcon from '@material-ui/icons/Style';
import StarIcon from '@material-ui/icons/Star';

import SwipeableViews from 'react-swipeable-views';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import Moment from 'moment';

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


@inject('SessionStore')
@observer
class CreateCategories extends React.Component {
    @observable isLoadingFlatform = false
    @observable isLoadingGenre = false
    @observable isFlatformChange = false
    @observable isGenreChange = false
    @observable errorFlatform
    @observable errorGenre
    @observable nameFlatform = ''
    @observable nameGenre = ''
    @observable nameGame = ''
    @observable nameDeveloper = ''
    @observable developerURL = ''
    @observable value = 0

    @observable flatforms = []
    @observable checkedFlatforms = []
    @observable genres = []
    @observable checkedGenre = []
    @observable developers = []
    @observable checkedDeveloper = []

    @observable filesDeveloper = []
    @observable filesGame = []
    @observable selectedDate = new Date()

    constructor(props) {
        super(props)
        this.state = {
            tabs: [
                {
                    name: 'Game'
                },
                {
                    name: 'Flatform x Genre x Developer'
                }
            ]
        }
    }
    componentDidMount() {
        this.getFlatform(true)
        this.getFlatform(false)
        this.getDeveloper()
    }

    getFlatform(isFlatform) {
        const URL = `${this.props.SessionStore.API_URL}${isFlatform ? 'flatform' : 'genre'}/read`
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                if (isFlatform)
                    this.flatforms = jsonResult.data.list
                else
                    this.genres = jsonResult.data.list
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getDeveloper() {
        const URL = `${this.props.SessionStore.API_URL}developer/read`
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.developers = jsonResult.data.list
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    handleChange = (event, value) => {
        this.value = value
    };

    handleChangeIndex = index => {
        this.value = index
    };

    handleCreateFlatformGenre = () => {
        if (this.value === 0) {
            if (this.nameFlatform.length === 0)
                return
        } else {
            if (this.nameGenre.length === 0)
                return
        }
        const url = `${this.props.SessionStore.API_URL}${this.value === 0 ? 'flatform' : 'genre'}/create`
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify({ name: this.value === 0 ? this.nameFlatform : this.nameGenre })
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.value === 0 ? this.isFlatformChange = true : this.isGenreChange = true
            }
            this.value === 0 ? this.errorFlatform = jsonResult.message : this.errorGenre = jsonResult.message
        }).catch((error) => {
            console.error(error);
        });
    }

    handleCreateDeveloper = () => {
        if (!this.nameDeveloper || !this.developerURL) {
            alert('Fill a developer name & URl')
            return
        }
        const bodyData = {
            name: this.nameDeveloper,
            url: this.developerURL
        }
        fetch(`${this.props.SessionStore.API_URL}developer/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify(bodyData)
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.nameDeveloper = ''
                this.developerURL = ''
                this.createDeveloperImage(jsonResult.data.id)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    createDeveloperImage(id) {
        var data = new FormData()
        if (this.filesDeveloper.length > 0 && id)
            data.append(`image`, this.filesDeveloper[0].file, this.filesDeveloper[0].name)
        else return
        fetch(`${this.props.SessionStore.API_URL}developer/image?id=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: data
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                alert('Upload image success!')
                this.filesDeveloper.splice(0, this.filesDeveloper.length)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    handleCreateGame = () => {
        if (!this.nameGame) {
            alert('Fill a game name')
            return
        }
        const checkedFlatforms = this.checkedFlatforms.map(index => this.flatforms[index].id)
        console.log(checkedFlatforms);
        const checkedGenre = this.checkedGenre.map(index => this.genres[index].id)
        console.log(checkedGenre)
        const bodyData = {
            name: this.nameGame,
            idDeveloper: this.checkedDeveloper.length > 0 ? this.developers[this.checkedDeveloper[0]].id : 0,
            releaseDate: Moment(this.selectedDate).unix(),
            flatform: checkedFlatforms,
            genre: checkedGenre,
        }
        fetch(`${this.props.SessionStore.API_URL}game/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: JSON.stringify(bodyData)
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                this.createGameImage(jsonResult.data.game.id)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    createGameImage(id) {
        if (!this.filesGame.length > 0 && !id) return
        var data = new FormData()
        this.filesGame.forEach((value, index) => data.append(`image${index}`, value.file, value.name))
        
        fetch(`${this.props.SessionStore.API_URL}game/image?id=${id}&size=${this.filesGame.length}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
            },
            body: data
        }).then((result) => {
            return result.json();
        }).then((jsonResult) => {
            console.log(jsonResult);
            if (jsonResult.success) {
                alert('Upload image success!')
                this.filesGame.splice(0, this.filesGame.length)
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    handleToggleFlatform = value => {
        const currentIndex = this.checkedFlatforms.indexOf(value);
        const newChecked = [...this.checkedFlatforms];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        console.log('handleToggleFlatform', newChecked)
        this.checkedFlatforms = newChecked
    };

    handleToggleGenre = value => {
        const currentIndex = this.checkedGenre.indexOf(value);
        const newChecked = [...this.checkedGenre];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        console.log('handleToggleGenre', newChecked)
        this.checkedGenre = newChecked
    };

    handleToggleDeveloper = value => {
        const currentIndex = this.checkedDeveloper.indexOf(value);
        const newChecked = [];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        console.log('handleToggleDeveloper', newChecked)
        this.checkedDeveloper = newChecked
    }

    handleDeveloperFileDelete = index => {
        this.filesDeveloper.splice(index, 1);
    };

    handleGameFileDelete = index => {
        this.filesGame.splice(index, 1);
    };

    handleDeveloperFileChange = e => {
        const value = e.target.value
        console.log('handleDeveloperFileChange', value)
        if (value) {
            var file = e.target.files
            this.filesDeveloper = [...this.filesDeveloper, { 'name': value, 'file': file[0] }]
        }
    }

    handleGameFileChange = e => {
        const value = e.target.value
        console.log('handleGameFileChange', value)
        if (value) {
            var file = e.target.files
            this.filesGame = [...this.filesGame, { 'name': value, 'file': file[0] }]
        }
    }

    handleDateChange = (date) => {
        this.selectedDate = date
    }

    render() {
        const { classes, theme, handleClose, isFlatformChange, isGenreChange, isChangeAll, open } = this.props
        return (
            <div className={classes.root}>
                <Dialog
                    fullScreen
                    TransitionComponent={Transition}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                Categories
                            </Typography>
                            <Button color="inherit" onClick={this.isFlatformChange && this.isGenreChange ? isChangeAll : this.isFlatformChange ? isFlatformChange : this.isGenreChange ? isGenreChange : handleClose} >
                                Close & Apply
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={this.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            {
                                this.state.tabs.map((item, index) => {
                                    return <Tab icon={index === 0 ? <GameIcon /> : index === 1 ? <StyleIcon /> : <StarIcon />} key={index} label={item.name} />
                                })
                            }
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={this.value}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        {
                            this.state.tabs.map((item, index) => {
                                if (index === 0)
                                    return (
                                        <TabContainer key={index} dir={theme.direction}>
                                            {this.Game(classes)}
                                        </TabContainer>
                                    )
                                else
                                    return (
                                        <TabContainer key={index} dir={theme.direction}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                {this.FlatFormGenre(classes)}
                                                {this.Developer(classes)}
                                            </div>
                                        </TabContainer>
                                    )
                            })
                        }
                    </SwipeableViews>
                </Dialog>
            </div>
        );
    }

    Game = (classes) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {[0, 1, 2].map((value, indexList) => {
                    var dataArray = []
                    var title = ''
                    switch (value) {
                        case 0:
                            dataArray = this.flatforms
                            title = 'Flatform'
                            break
                        case 1:
                            dataArray = this.genres
                            title = 'Genre'
                            break
                        case 2:
                            dataArray = this.developers
                            title = 'Developer'
                            break
                        default: break
                    }
                    return (
                        <div key={indexList} style={{ border: '1px solid gray', marginRight: 10 }}>
                            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                            <List className={classes.list}>
                                {dataArray.map((item, index) => {
                                    const labelId = `checkbox-list-label-${index}`;

                                    return (
                                        <ListItem key={index} role={undefined} dense button
                                            onClick={() => value === 0 ?
                                                this.handleToggleFlatform(index) :
                                                value === 1 ?
                                                    this.handleToggleGenre(index) :
                                                    this.handleToggleDeveloper(index)
                                            }>
                                            <ListItemIcon>
                                                {
                                                    value < 2 ?
                                                        <Checkbox
                                                            edge="start"
                                                            checked={value === 0 ?
                                                                this.checkedFlatforms.indexOf(index) !== -1 :
                                                                this.checkedGenre.indexOf(index) !== -1}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        /> :
                                                        <Radio
                                                            edge="start"
                                                            checked={this.checkedDeveloper.indexOf(index) !== -1}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                }

                                            </ListItemIcon>
                                            <ListItemText id={labelId} primary={item.name} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                    )
                })}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle id="alert-dialog-title">Game</DialogTitle>
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
                    <TextField
                        required
                        label={`Enter game name`}
                        className={classes.textField}
                        value={this.nameGame}
                        onChange={event => this.nameGame = event.target.value}
                        margin="normal" />
                    <div>
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file-game"
                            multiple
                            type="file"
                            onChange={this.handleGameFileChange}
                        />
                        <label htmlFor="contained-button-file-game">
                            <Button variant="contained" component="span" className={classes.button}>
                                Select game image
                            </Button>
                        </label>
                        <List dense className={classes.rootImageList}>
                            {this.filesGame.map((item, index) => (
                                <ListItem key={index} button>
                                    <ListItemText primary={item.name} />
                                    <ListItemSecondaryAction>
                                        <ClearIcon onClick={() => this.handleGameFileDelete(index)} />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <Button onClick={this.handleCreateGame} variant="contained" color="secondary">Submit</Button>
                </div>
            </div>
        )
    }

    Developer = (classes) => {
        return (
            <div>
                <DialogTitle id="alert-dialog-title">Developer</DialogTitle>
                <DialogContent>
                    <div id="alert-dialog-description">
                        <TextField
                            required
                            label={`Enter developer name`}
                            className={classes.textField}
                            value={this.nameDeveloper}
                            onChange={event => this.nameDeveloper = event.target.value}
                            margin="normal" />
                    </div>
                    <div id="alert-dialog-description">
                        <TextField
                            required
                            label={`Enter developer URL`}
                            className={classes.textField}
                            value={this.developerURL}
                            onChange={event => this.developerURL = event.target.value}
                            margin="normal" />
                    </div>
                    <div>
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file-developer"
                            multiple
                            type="file"
                            onChange={this.handleDeveloperFileChange}
                        />
                        <label htmlFor="contained-button-file-developer">
                            <Button variant="contained" component="span" className={classes.button}>
                                Select logo image
                            </Button>
                        </label>
                        <List dense className={classes.rootImageList}>
                            {this.filesDeveloper.map((item, index) => (
                                <ListItem key={index} button>
                                    <ListItemText primary={item.name} />
                                    <ListItemSecondaryAction>
                                        <ClearIcon onClick={() => this.handleDeveloperFileDelete(index)} />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <Button variant="contained" color="secondary" onClick={this.handleCreateDeveloper} >Submit</Button>
                </DialogContent>
            </div>
        )
    }

    FlatFormGenre = (classes) => {
        return (
            [0, 1].map(index => {
                return (
                    <div key={index}>
                        <DialogTitle id="alert-dialog-title">Create new {index === 0 ? 'Flatform' : 'Genre'}</DialogTitle>
                        <DialogContent>
                            <div id="alert-dialog-description">
                                <TextField
                                    required
                                    label={`Enter ${index === 0 ? 'flatform' : 'genre'} name`}
                                    className={classes.textField}
                                    value={index === 0 ? this.nameFlatform : this.nameGenre}
                                    onChange={event => index === 0 ? this.nameFlatform = event.target.value : this.nameGenre = event.target.value}
                                    margin="normal" />
                            </div>
                            {
                                index === 0 ? this.isLoadingFlatform && 'Submiting data...' : this.isLoadingGenre && 'Submiting data...'
                            }
                            {
                                index === 0 ? this.errorFlatform : this.errorGenre
                            }
                            <Button color="secondary" variant="contained" onClick={this.handleCreateFlatformGenre} >Submit</Button>
                        </DialogContent>
                        <DialogActions>

                        </DialogActions>
                    </div>
                )
            })
        )
    }
}

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 500,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '240',
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(1),
    },
    rootImageList: {
        width: 'fit-content',
        backgroundColor: theme.palette.background.paper,
    }
});

CreateCategories.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CreateCategories);
