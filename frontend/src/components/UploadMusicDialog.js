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
        //getting file object
        let files = event.target.files
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif']
        // loop access array
        for (var x = 0; x < files.length; x++) {
            // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type + ' is not a supported format\n';
            }
        };

        if (err !== '') { // if message not same old that mean has error 
            event.target.value = null // discard selected file
            console.log(err)
            return false;
        }
        return true;

    }
    handleFileChange = (e) => {
        const value = e.target.value
        if (value) {
            this.props.handleMusicFileChange(e.target.files)
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
                                accept="image/*"
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
                        <Button onClick={handleClose} color="primary">Cancel</Button>
                        <Button onClick={handleClose} color="primary">Subscribe</Button>
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
