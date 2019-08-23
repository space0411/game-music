import React from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx'
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Drawer, List, IconButton, ListItem, Slider, Button, Tooltip } from '@material-ui/core';

import SvgIcon from '@material-ui/core/SvgIcon';
import { purple } from '@material-ui/core/colors';
import { QueueMusic } from '@material-ui/icons';
import ColoredScrollbars from '../utils/ColoredScrollbars';


function PlayIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </SvgIcon>
    );
}

function PauseIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </SvgIcon>
    );
}

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

function ArrowDownIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        </SvgIcon>
    );
}

function ArrowUpIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </SvgIcon>
    );
}

function CloseIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </SvgIcon>
    );
}

@inject('ScreenStore', 'SessionStore')
@observer
class MusicPlayerDialog extends React.Component {
    audioPlayer
    @observable currentSlider = 0
    @observable openQueueMusic = false
    @observable currentMusicIndex = 0
    @observable currentMusic
    @observable timeMusic
    @observable isPlay = false
    @observable loop = false
    @observable shuffle = false
    savedMusicArray = []
    savedMusic

    componentDidMount() {
        this.initAudioPlayer()
    }

    initAudioPlayer() {
        const that = this
        const audioPlayer = document.getElementById('audioPlayer')
        this.audioPlayer = audioPlayer
        // audioPlayer.addEventListener('loadedmetadata', function () {
        //     // audioPlayer.setAttribute('data-time', audioPlayer.duration);
        //     console.log(audioPlayer.duration)
        // }, false)
        audioPlayer.addEventListener('ended', function () {
            console.log('end')
            that.handleNext()
        })
        audioPlayer.addEventListener('canplay', function () {
            that.isPlay = true
        })
    }

    handleDrawerClose = () => {
        this.openQueueMusic = !this.openQueueMusic
    }

    handleDrawerCloseParent = (event) => {
        event.preventDefault();
        if (event.target === event.currentTarget) {
            this.openQueueMusic = !this.openQueueMusic
        }
    }

    handleSliderChange = (event, newValue) => {
        const rate = Math.floor(newValue / 100 * this.audioPlayer.duration)
        console.log('rate', rate)
        this.audioPlayer.currentTime = rate
    };

    handleMusicItemClick = (item, index) => {
        this.currentMusic = item
        this.currentMusicIndex = index
    }

    handleAudioTimeUpdate = () => {
        this.updateTrackTime(this.audioPlayer)
    }

    updateTrackTime(track) {
        function formatSecondsAsTime(secs) {
            var hr = Math.floor(secs / 3600);
            var min = Math.floor((secs - (hr * 3600)) / 60);
            var sec = Math.floor(secs - (hr * 3600) - (min * 60));

            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }

            return min + ':' + sec;
        }
        var currTime = Math.floor(track.currentTime).toString();
        var duration = Math.floor(track.duration).toString();

        let fDuration = '00:00'
        let fCurrentTime = formatSecondsAsTime(currTime);

        if (!isNaN(duration))
            fDuration = formatSecondsAsTime(duration);
        this.currentSlider = Math.floor(currTime / duration * 100)
        this.timeMusic = fCurrentTime + ' / ' + fDuration
    }
    handlePrev = () => {
        this.pauseMusic()
        const { musics } = this.props.ScreenStore
        if (musics.length > 0)
            if (this.currentMusicIndex > 0) {
                this.currentMusicIndex--
                this.currentMusic = musics[this.currentMusicIndex]
            } else {
                this.currentMusicIndex = 0
                this.currentMusic = musics[0]
            }
    }

    handlePlay = () => {
        this.isPlay ? this.audioPlayer.pause() : this.audioPlayer.play()
        this.isPlay = !this.isPlay
    }

    handleNext = () => {
        this.pauseMusic()
        const { musics } = this.props.ScreenStore
        if (musics.length > 0)
            if (this.currentMusicIndex < musics.length - 1) {
                this.currentMusicIndex++
                this.currentMusic = musics[this.currentMusicIndex]
            } else {
                this.currentMusicIndex = 0
                this.currentMusic = musics[0]
            }
    }

    pauseMusic() {
        this.audioPlayer.pause()
        this.isPlay = false
    }

    getMusicInfo(currentMusic) {
        const { getMusic } = this.props.SessionStore
        const { musics } = this.props.ScreenStore
        const data = {
            id: 999,
            url: '',
            name: ''
        }
        if (currentMusic) {
            data.id = currentMusic.id
            data.url = getMusic(currentMusic.url)
            data.name = currentMusic.name
        } else {
            if (musics.length > 0) {
                data.id = musics[this.currentMusicIndex].id
                data.url = getMusic(musics[this.currentMusicIndex].url)
                data.name = musics[this.currentMusicIndex].name
            }
        }
        this.savedMusic = data
        return data
    }


    handleShuffle = () => {
        this.shuffle = !this.shuffle
        const { musics } = this.props.ScreenStore
        if (this.shuffle) {
            this.savedMusicArray = [...musics]
            function shuffleMusics(array) {
                return array.slice().sort(() => Math.random() - 0.5);
            }
            const arr = shuffleMusics(musics)
            this.props.ScreenStore.setDataMusicPlayer(arr)
        } else {
            this.props.ScreenStore.setDataMusicPlayer(this.savedMusicArray)
        }
        this.caculatePrevIndex()
    }

    caculatePrevIndex() {
        const that = this
        function isOdd(element) {
            return (element.id === that.savedMusic.id);
        }

        const prevItemIndex = this.props.ScreenStore.musics.findIndex(isOdd);
        if (prevItemIndex !== -1) {
            this.currentMusicIndex = prevItemIndex
            this.currentMusic = this.props.ScreenStore.musics[prevItemIndex]
        }
    }

    hanldeLoop = () => {
        this.loop = !this.loop
    }

    handleMusicPlayerClose = () => {
        this.audioPlayer.pause()
        this.props.ScreenStore.closeMusicPlayer()
    }

    render() {
        const currentMusic = this.currentMusic
        const openQueueMusic = this.openQueueMusic
        const { isOpenMusicPlayer, musics } = this.props.ScreenStore
        const { classes } = this.props
        const musicData = this.getMusicInfo(currentMusic)
        let time = '00:00 / 00:00'
        if (this.timeMusic) time = this.timeMusic
        return (
            <div>
                <audio
                    id='audioPlayer'
                    src={musicData.url}
                    autoPlay
                    loop={this.loop}
                    onTimeUpdate={this.handleAudioTimeUpdate}>
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
                        <PrevIcon onClick={this.handlePrev} className={classes.nextPrevButton} style={styles.normalIcon} />
                        {
                            this.isPlay ? <PauseIcon onClick={this.handlePlay} className={classes.iconHover} style={styles.largeIcon} />
                                : <PlayIcon onClick={this.handlePlay} className={classes.iconHover} style={styles.largeIcon} />
                        }
                        <NextIcon onClick={this.handleNext} className={classes.nextPrevButton} style={styles.normalIcon} />
                        <ShuffleIcon onClick={this.handleShuffle} className={this.shuffle ? classes.nextPrevButtonActived : classes.nextPrevButton} />
                        <LoopIcon onClick={this.hanldeLoop} className={this.loop ? classes.nextPrevButtonActived : classes.nextPrevButton} />
                        {this.Music(classes, musicData.name, time)}
                        <VolumeIcon className={classes.nextPrevButton} />
                        <div style={styles.verticalLine} />
                        <Button onClick={this.handleDrawerClose} variant="contained" color="secondary" className={classes.button}>
                            <QueueMusic className={classes.rightIcon} />
                            Queue music ({musics.length})
                        </Button>

                        <Tooltip title="Close player">
                            <IconButton size="small" onClick={this.handleMusicPlayerClose}>
                                <CloseIcon className={classes.iconHover} style={styles.normalIcon} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </Drawer>
            </div>
        );
    }

    Music = (classes, name, time) => {
        return (
            <div style={styles.mainMusic}>
                <div style={{
                    ...{
                        backgroundImage: "url(https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350)",
                    }, ...styles.cover
                }} />
                <div style={styles.musicInfo}>
                    <div style={styles.mainText}>
                        <div style={styles.text}>{name}</div>
                        <div>{time}</div>
                    </div>
                    <Slider
                        className={classes.slider}
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
                <div onClick={this.handleDrawerCloseParent} className={classes.toolbarQueue}>
                    <div className={classes.playlist}>
                        <div style={styles.queueButton}>
                            <IconButton size="small" onClick={this.handleDrawerClose}>
                                {open ? <ArrowDownIcon className={classes.iconHover} style={styles.largeIcon} /> : <ArrowUpIcon className={classes.iconHover} style={styles.largeIcon} />}
                            </IconButton>
                        </div>
                        <div style={styles.queueHeader}>PLAYLIST ({musics.length})</div>
                        <ColoredScrollbars>
                            <List>
                                {musics.map((item, index) => {
                                    const bg = {
                                        color: 'white',
                                        backgroundColor: index % 2 === 0 && 'rgba(72,72,72,0.1)',
                                    }
                                    if (this.currentMusicIndex === index) {
                                        bg.backgroundColor = 'rgba(239,239,239,0.1)'
                                        bg.color = purple[400]
                                    }
                                    return (
                                        <ListItem onClick={() => this.handleMusicItemClick(item, index)} className={classes.item} style={{ ...styles.queueItem, ...bg }} button key={index}>
                                            <div style={styles.queueItemContent}>
                                                <div>{index + 1}</div>
                                                <div style={styles.queueItemName}>{item.name}</div>
                                            </div>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </ColoredScrollbars>
                    </div>
                </div>

            </Drawer>
        )
    }
}

const styles = {
    verticalLine: { width: 2, height: 40, backgroundColor: 'gray' },
    normalIcon: { fontSize: 32 },
    largeIcon: { fontSize: 45 },
    mainMusic: { display: 'flex', marginLeft: '5%', marginRight: '5%' },
    cover: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        borderRadius: 2,
        width: 40,
        height: 40
    },
    musicInfo: { display: 'flex', flexDirection: 'column', marginLeft: 20 },
    mainText: { display: 'flex', color: 'white', width: 400, justifyContent: 'space-between' },
    text: {
        width: 400,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    queueButton: { marginTop: 16, marginRight: 16, display: 'flex', justifyContent: 'flex-end' },
    queueHeader: { marginTop: 5, marginLeft: 16, color: 'gray' },
    queueItem: {
        padding: '10px 20px',
    },
    queueItemContent: { display: 'flex' },
    queueItemName: { marginLeft: 10 }
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
        justifyContent: 'flex-start',
        padding: '0 8px 0 300px',
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
    nextPrevButtonActived: {
        margin: theme.spacing(1),
        color: purple[500],
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
        width: '70%',
        backgroundColor: '#0c0e12',
        color: 'white',
        paddingBottom: 80,
        zIndex: 1
    },
    item: {
        '&:hover': {
            color: purple[400],
            backgroundColor: 'rgba(239,239,239,0.1) !important'
        },
    },
    slider: {
        color: purple[500],
    }
});

MusicPlayerDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
    theme: PropTypes.object.isRequired,
};

export default withStyles(useStyles, { withTheme: true })(MusicPlayerDialog);
