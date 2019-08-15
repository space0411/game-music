import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, List, IconButton, ListItem, ListItemIcon, ListItemText, Slider, Button } from '@material-ui/core';

import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import SvgIcon from '@material-ui/core/SvgIcon';
import { purple } from '@material-ui/core/colors';
import { QueueMusic } from '@material-ui/icons';

function PlayIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </SvgIcon>
    );
}

// function PauseIcon(props) {
//     return (
//         <SvgIcon {...props}>
//             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
//         </SvgIcon>
//     );
// }

function NextIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </SvgIcon>
    );
}

function PrevIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </SvgIcon>
    );
}
function ShuffleIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
        </SvgIcon>
    );
}
function LoopIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </SvgIcon>
    );
}

function VolumeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </SvgIcon>
    );
}

@inject('ScreenStore', 'SessionStore')
@observer
class MusicPlayerDialog extends React.Component {
    audioPlayer
    @observable currentSlider = 0
    @observable openQueueMusic = false
    @observable currentMusic

    componentDidMount() {
        this.audioPlayer = document.getElementById('audioPlayer');
        // console.log(this.audioPlayer)
        // this.audioPlayer.play()
    }

    handleDrawerClose = () => {
        this.openQueueMusic = !this.openQueueMusic
    }

    handleSliderChange = (event, newValue) => {
        this.currentSlider = newValue
    };

    handleMusicItemClick = (item) => {
        this.currentMusic = item
    }

    render() {
        const currentMusic = this.currentMusic
        const openQueueMusic = this.openQueueMusic
        const { isOpenMusicPlayer, musics } = this.props.ScreenStore
        const { getMusic } = this.props.SessionStore
        const { classes } = this.props
        let musicUrl = ''
        let musicName = ''
        if (currentMusic) {
            musicUrl = getMusic(currentMusic.url)
            musicName = currentMusic.name
        }
        return (
            <div>
                <audio
                    id='audioPlayer'
                    src={musicUrl}>
                    Your browser does not support the
                    <code>audio</code> element.
                </audio>
                {this.QueueMusicPlaylist(classes, openQueueMusic, musics)}
                <Drawer
                    anchor="bottom"
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: isOpenMusicPlayer,
                        [classes.drawerClose]: !isOpenMusicPlayer,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: isOpenMusicPlayer,
                            [classes.drawerClose]: !isOpenMusicPlayer,
                        }),
                    }}
                    open={isOpenMusicPlayer}
                >
                    <div className={classes.toolbar}>
                        <PrevIcon className={classes.nextPrevButton} style={{ fontSize: 32 }} />
                        <PlayIcon className={classes.iconHover} style={{ fontSize: 45 }} />
                        <NextIcon className={classes.nextPrevButton} style={{ fontSize: 32 }} />
                        <ShuffleIcon className={classes.nextPrevButton} />
                        <LoopIcon className={classes.nextPrevButton} />
                        {this.Music(musicName)}
                        <VolumeIcon className={classes.nextPrevButton} />
                        <div style={{ width: 2, height: '70%', backgroundColor: 'gray' }} />
                        <Button onClick={this.handleDrawerClose} variant="contained" color="secondary" className={classes.button}>
                            <QueueMusic className={classes.rightIcon} />
                            Queue music ({musics.length})
                        </Button>
                        <IconButton onClick={this.handleDrawerClose}>
                            {isOpenMusicPlayer ? <ArrowDownIcon /> : <ArrowUpIcon />}
                        </IconButton>
                    </div>
                </Drawer>
            </div>
        );
    }

    Music = (name) => {
        return (
            <div style={{ display: 'flex', marginLeft: '5%', marginRight: '5%' }}>
                <div style={{
                    backgroundImage: "url(https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350)",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 2,
                    width: 40,
                    height: 40
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                    <div style={{ display: 'flex', color: 'white', width: 500, justifyContent: 'space-between' }}>
                        <div style={{
                            width: 400,
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap'
                        }}>{name}</div>
                        <div>00:01/04:10</div>
                    </div>
                    <Slider
                        value={this.currentSlider}
                        onChange={this.handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </div>
            </div >
        )
    }

    QueueMusicPlaylist = (classes, open, musics) => {
        return (
            <Drawer
                anchor="bottom"
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerQueueOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerQueueOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={open}
            >
                <div className={classes.toolbarQueue}>
                    <div className={classes.playlist}>
                        <div style={{ marginTop: 16, marginRight: 16, display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={this.handleDrawerClose}>
                                {open ? <ArrowDownIcon /> : <ArrowUpIcon />}
                            </IconButton>
                        </div>
                        <div style={{ marginTop: 5, marginLeft: 16, color: 'gray' }}>PLAYLIST ({musics.length})</div>
                        <div>
                            <List>
                                {musics.map((item, index) => {
                                    const bg = {
                                        padding: '10px 20px',
                                        backgroundColor: index % 2 === 0 && 'rgba(72,72,72,0.1)',
                                    }
                                    return (
                                        <ListItem onClick={() => this.handleMusicItemClick(item)} className={classes.item} style={bg} button key={index}>
                                            <div style={{ display: 'flex' }}>
                                                <div>{index + 1}</div>
                                                <div style={{ marginLeft: 10 }}>{item.name}</div>
                                            </div>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </div>
                    </div>
                </div>

            </Drawer>
        )
    }
}

const drawerWidth = 'auto';

const useStyles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerQueueOpen: {
        width: drawerWidth,
        height: '100%',
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: 'transparent'
    },
    drawerClose: {
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        overflowY: 'hidden',
        // height: theme.spacing(7) + 1,
        // [theme.breakpoints.up('sm')]: {
        //     height: theme.spacing(8) + 1,
        // },
        height: 0,
        [theme.breakpoints.up('sm')]: {
            height: 0,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 8px 0 300px',
        ...theme.mixins.toolbar,
        backgroundColor: '#32323d'
    },
    toolbarQueue: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 8px 0 0',
        ...theme.mixins.toolbar,
        alignItems: 'stretch'
    },
    nextPrevButton: {
        margin: theme.spacing(1),
        color: '#f5f5f5',
        '&:hover': {
            color: purple[400],
        },
    },
    iconHover: {
        margin: theme.spacing(1),
        color: purple[500],
        '&:hover': {
            color: purple[400],
        },
    },
    playlist: {
        display: 'flex',
        flexDirection: 'column',
        width: '65%',
        backgroundColor: '#0c0e12',
        color: 'white'
    },
    item: {
        '&:hover': {
            color: purple[400],
            backgroundColor: 'rgba(239,239,239,0.1) !important'
        },
    }
});

MusicPlayerDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
    theme: PropTypes.object.isRequired,
};

export default withStyles(useStyles, { withTheme: true })(MusicPlayerDialog);
