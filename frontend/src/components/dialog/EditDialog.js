import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

class EditDialog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            url: ''
        }
    }

    handleChangeName = (e) => {
        this.setState({ name: e.target.value })
        const data = this.props.data
        data.name = e.target.value
    }

    handleChangeUrl = (e) => {
        this.setState({ url: e.target.value })
        const data = this.props.data
        data.url = e.target.value
    }

    handleApplyChange = (data) => {
        if (data.name.length < 1) {
            return
        }
        this.props.handleAgree(data)
        this.setState({ name: '', url: '' })
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
                            label='Name'
                            className={classes.textField}
                            value={data.name || ''}
                            onChange={this.handleChangeName}
                            margin="normal" />
                        {data.url &&
                            <TextField
                                required
                                label='Url'
                                className={classes.textField}
                                value={data.url || ''}
                                onChange={this.handleChangeUrl}
                                margin="normal" />
                        }

                    </DialogContent>
                    <DialogActions>
                        <div>
                            <Button onClick={() => this.handleApplyChange(data)} color="primary">Apply</Button>
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
