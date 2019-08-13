import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { withStyles } from '@material-ui/core/styles';

function PaperComponent(props) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}
class UploadMusicDialog extends React.Component {
    checkMimeType = (event) => {
        // https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/
        let files = event.target.files
        let err = ''
        // list allow mime type
        // const types = ['image/png', 'image/jpeg', 'image/gif']
        const types = ['audio/mp3']
        for (var x = 0; x < files.length; x++) {
            for (var y = 0; y < types.length; y++) {
                if (files[x].type !== types[y])
                    err += files[x].type + ' is not a supported format\n';
                else {
                    err = ''
                    break
                }
            }
        };

        if (err !== '') {
            event.target.value = null
            console.log(err)
            return false;
        }
        return true;

    }
    handleFileChange = (event) => {
        var files = event.target.files
        if (this.checkMimeType(event)) {
            this.props.handleMusicFileChange(files)
        }
    }
    render() {
        const { classes, open, handleClose } = this.props
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Upload Music File
                </DialogTitle>
                    <DialogContent>
                        <div style={{ width: 300, height: 200, border: '1px dotted red', borderRadius: 5 }}>
                            <input
                                accept="audio/*"
                                className={classes.input}
                                id="contained-button-file-music-upload"
                                multiple
                                type="file"
                                onChange={this.handleFileChange}
                            />
                            <label style={{ marginTop: 60, marginLeft: 75 }} htmlFor="contained-button-file-music-upload">
                                <Button variant="contained" component="span" className={classes.button}>Select image</Button>
                            </label>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
const useStyles = theme => ({
    input: {
        display: 'none',
    },
    button: {
        margin: theme.spacing(1),
    },
});
export default withStyles(useStyles, { withTheme: true })(UploadMusicDialog)
