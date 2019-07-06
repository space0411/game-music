import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class AlertDialog extends React.Component {

    render() {
        const { handleOke, handleClose, handleDisagree, handleAgree, data, open } = this.props
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{data.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {data.content}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {
                            handleOke ? <Button onClick={handleOke} color="primary" autoFocus>oke</Button> :
                                <div>
                                    <Button onClick={handleDisagree} color="primary">
                                        Disagree
                                    </Button>
                                    <Button onClick={handleAgree} color="primary" autoFocus>
                                        Agree
                                    </Button>
                                </div>
                        }
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const styles = {
    
};

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

export default withStyles(styles)(AlertDialog);
