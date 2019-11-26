import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class EditMusicDialog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            url: '',
            artist: '',
            duration: 0,
            data: undefined,
            hour: 0,
            minute: 0,
            second: 0,
        }
    }

    handleChangeName = (e) => {
        this.setState({ name: e.target.value })
    }

    handleChangeArtist = (e) => {
        this.setState({ artist: e.target.value })
    }

    handleChangeUrl = (e) => {
        this.setState({ url: e.target.value })
    }

    handleApplyChange = () => {
        const { name, duration, data, artist } = this.state
        const rawData = {
            id: data.id,
            name,
            duration,
            artist
        }
        this.props.handleAgree(rawData)
    }

    handleDurationChange = (event, type) => {
        const text = Math.floor(event.target.value)
        const { hour, minute, second } = this.state
        switch (type) {
            case 'h':
                this.setState({
                    hour: text,
                    duration: this.caculateTime(text, minute, second)
                })
                break
            case 'm':
                this.setState({
                    minute: text,
                    duration: this.caculateTime(hour, text, second)
                })
                break
            case 's':
                this.setState({
                    second: text,
                    duration: this.caculateTime(hour, minute, text)
                })
                break
            default: break
        }
    }

    caculateTime(h, m, s) {
        return (h * 3600 + m * 60 + s) * 1000
    }

    msToHMS(ms) {
        // 1- Convert to seconds:
        var seconds = ms / 1000;
        // 2- Extract hours:
        var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        return (hours + ":" + minutes + ":" + seconds);
    }

    getMsToHMS(ms) {
        // 1- Convert to seconds:
        var seconds = ms / 1000;
        // 2- Extract hours:
        var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = seconds % 60;
        return { hours, minutes, seconds }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            const data = nextProps.data
            if (data) {
                const { hours, minutes, seconds } = this.getMsToHMS(data.duration)
                this.setState({
                    data: nextProps.data,
                    name: data.name,
                    url: data.url,
                    duration: data.duration,
                    hour: hours,
                    minute: minutes,
                    second: seconds,
                    artist: data.artist
                });
            }
        }
    }

    render() {
        const { classes, handleClose, open } = this.props
        const { data, name, artist, url, duration, hour, minute, second } = this.state
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Edit - ID {data && data.id}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Fill a field for edit
                        </DialogContentText>
                        <TextField
                            required
                            label='Name'
                            className={classes.textField}
                            value={name}
                            onChange={this.handleChangeName}
                            margin="normal" />
                        <TextField
                            required
                            label='Artist'
                            className={classes.textField}
                            value={artist}
                            onChange={this.handleChangeArtist}
                            margin="normal" />
                        <TextField
                            required
                            disabled
                            label='Url'
                            className={classes.textField}
                            value={url}
                            // onChange={this.handleChangeUrl}
                            margin="normal" />
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <TextField
                                required
                                type="number"
                                label="Hour"
                                className={classes.textFieldTime}
                                value={hour}
                                onChange={event => this.handleDurationChange(event, 'h')}
                                margin="normal" />
                            <TextField
                                required
                                type="number"
                                label="Minute"
                                className={classes.textFieldTime}
                                value={minute}
                                onChange={event => this.handleDurationChange(event, 'm')}
                                margin="normal" />
                            <TextField
                                required
                                type="number"
                                label="Second"
                                className={classes.textFieldTime}
                                value={second}
                                onChange={event => this.handleDurationChange(event, 's')}
                                margin="normal" />
                        </div>
                        <div>{`Duration: ${this.msToHMS(duration)}`} = {`${duration} milis`}</div>
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <Button onClick={this.handleApplyChange} color="primary">Apply</Button>
                            <Button onClick={handleClose} color="primary" autoFocus>Close</Button>
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
    },
    textFieldTime: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 100,
    },
})

EditMusicDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

export default withStyles(styles)(EditMusicDialog);
