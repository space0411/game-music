import React from 'react';
import {
    Button, Dialog, AppBar,
    Typography, Toolbar, Slide,
    IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { observer, inject } from 'mobx-react';
import CreateFGGDScreen from './CreateFGGDScreen';

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

    render() {
        const { classes, handleClose, open } = this.props
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
                            <Button color="inherit" onClick={handleClose} >
                                Close
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <CreateFGGDScreen />
                </Dialog>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
});

CreateCategories.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CreateCategories);
