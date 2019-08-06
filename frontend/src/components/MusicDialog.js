import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Slide from '@material-ui/core/Slide';

import { observer } from 'mobx-react';
import { observable } from 'mobx';
import UploadMusicDialog from './UploadMusicDialog';

const useStyles = theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

@observer
class MusicDialog extends React.Component {
  @observable musics = []
  @observable openUploadFile = false

  handleCloseUploadMusic = () => {
    this.openUploadFile = false
  }

  handleMusicFileChange = (files) => {
    this.musics = [...this.musics, ...files]
  }

  handleOpenUpload = () => {
    this.openUploadFile = true
  }

  render() {
    const { classes, open, handleClose } = this.props
    return (
      <div>
        <UploadMusicDialog open={this.openUploadFile} handleClose={this.handleCloseUploadMusic} handleMusicFileChange={this.handleMusicFileChange} />
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Sound
              </Typography>            
              <Button edge="start" color="inherit" onClick={this.handleOpenUpload} aria-label="upload music">
                Select Music <NoteAddIcon />
              </Button>
              <Button edge="start" color="inherit" onClick={this.handleOpenUpload} aria-label="upload music">
                Upload to server <CloudUploadIcon />
              </Button>
              <Button color="inherit" onClick={handleClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            {
              this.musics.map((item, index) => (
                <div key={index}>
                  <ListItem button>
                    <ListItemText primary="Phone ringtone" secondary={item.name} />
                  </ListItem>
                  <Divider />
                </div>
              ))
            }
          </List>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(useStyles, { withTheme: true })(MusicDialog)
