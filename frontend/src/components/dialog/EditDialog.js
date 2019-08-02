import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class EditDialog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: ''
        }
    }

    handleChangeName = (e) => {
        this.setState({ name: e.target.value })
    }

    handleApplyChange = (id) => {
        if (this.state.name.length < 1) {
            return
        }
        const name = this.state.name
        this.props.handleAgree(name, id)
        this.setState({ name: '' })
    }

    render() {
        const { classes, handleClose, data, open } = this.props
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{data.title} - ID {data.id}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {data.content}
                        </DialogContentText>
                        <TextField
                            required
                            label={data.name}
                            className={classes.textField}
                            value={this.state.name}
                            onChange={this.handleChangeName}
                            margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <div>
                            <Button onClick={() => this.handleApplyChange(data.id)} color="primary">Apply</Button>
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
})

EditDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

export default withStyles(styles)(EditDialog);
