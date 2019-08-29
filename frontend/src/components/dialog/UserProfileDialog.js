import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class UserProfileDialog extends React.Component {

    render() {
        const { classes, handleClose, data, open } = this.props
        let user = {
            email: '',
            name: '',
            phone: '',
            role: ''
        }
        if (data && data.user)
            user = data.user
        return (
            < div >
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Profile</DialogTitle>
                    <Divider light />
                    <DialogContent>
                        <div style={{ minWidth: 300 }}>
                            Email:
                            <DialogContentText id="alert-dialog-description" className={classes.content}>
                                {user.email}
                            </DialogContentText>
                            Name:
                            <DialogContentText id="alert-dialog-description" className={classes.content}>
                                {user.name}
                            </DialogContentText>
                            Role:
                            <DialogContentText id="alert-dialog-description" className={classes.content}>
                                {user.role}
                            </DialogContentText>
                            Phone:
                            <DialogContentText id="alert-dialog-description" className={classes.content}>
                                {user.phone}
                            </DialogContentText>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" autoFocus>Close</Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

const useStyles = theme => ({
    content: {
        color: 'black'
    }
});

UserProfileDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
};

export default withStyles(useStyles)(UserProfileDialog);
