import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, Dialog, ListItemText, ListItem, List,
  Divider, AppBar, Toolbar, IconButton, Typography,
  Slide, TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import UploadMusicDialog from './UploadMusicDialog';
import { DragDropContext, Droppable, Draggable, resetServerContext } from "react-beautiful-dnd";

const useStyles = theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  textField: {
    marginRight: theme.spacing(1),
    width: 300,
  },
  textFieldTime: {
    marginRight: theme.spacing(1),
    width: 100,
  },
  item: {

  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "white",
});

@inject('SessionStore')
@observer
class MusicDialog extends React.Component {
  @observable musics = []
  @observable openUploadFile = false

  handleCloseUploadMusic = () => {
    this.openUploadFile = false
  }

  handleMusicFileChange = (files) => {
    const myMusics = [...this.musics, ...files]
    this.musics = myMusics.map((value, index) => value.id ? value :
      Object.assign(value, { id: `item-${index}`, duration: 0, hour: 0, minute: 0, second: 0 }))
    console.log(this.musics)
  }

  handleOpenUpload = () => {
    this.openUploadFile = true
  }

  handleTitleChange = (event, myindex) => {
    this.musics = this.musics.map((value, index) => index === myindex ? Object.assign(value, { title: event.target.value }) : value)
    resetServerContext()
  }

  handleDurationChange = (event, myindex, type) => {
    const text = Math.floor(event.target.value)
    switch (type) {
      case 'h':
        this.musics = this.musics.map((value, index) => index === myindex ?
          Object.assign(value, { duration: this.caculateTime(text, value.minute, value.second), hour: text }) : value)
        break
      case 'm':
        this.musics = this.musics.map((value, index) => index === myindex ?
          Object.assign(value, { duration: this.caculateTime(value.hour, text, value.second), minute: text }) : value)
        break
      case 's':
        this.musics = this.musics.map((value, index) => index === myindex ?
          Object.assign(value, { duration: this.caculateTime(value.hour, value.minute, text), second: text }) : value)
        break
      default: break
    }

    resetServerContext()
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

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.musics,
      result.source.index,
      result.destination.index
    )
    this.musics = items
    console.log(this.musics)
  }

  handleUploadMusic = () => {
    const { openAlertDialog, productData } = this.props
    console.log('handleUploadMusic', this.musics.length, productData)
    if (productData.id && this.musics.length > 0) {
      var data = new FormData()
      var musicData = []
      this.musics.forEach(file => {
        data.append('file', file)
        musicData.push({ name: file.title, duration: file.duration })
      })
      console.log(musicData)
      if (musicData.length > 0)
        fetch(`${this.props.SessionStore.API_URL}music/create?productId=${productData.id}&musics=${JSON.stringify(musicData)}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
          },
          body: data
        }).then((result) => {
          return result.json();
        }).then((jsonResult) => {
          console.log(jsonResult);
          if (openAlertDialog) {
            openAlertDialog({
              title: 'Notify',
              content: jsonResult.message
            })
          }
        }).catch((error) => {
          console.error(error);
        });
    }
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
                Upload Music
              </Typography>
              <Button variant="contained" color="secondary" onClick={this.handleOpenUpload} aria-label="Select music">
                <NoteAddIcon />Select Music
              </Button>
              <Button style={{ marginLeft: 8 }} variant="contained" color="secondary" onClick={this.handleUploadMusic} aria-label="Upload music">
                <CloudUploadIcon />Upload to server
              </Button>
            </Toolbar>
          </AppBar>
          <List>
            <DragDropContext constantProp={this.musics} onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.musics.map((item, index) => {
                      return (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div>
                                <ListItem button>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <TextField
                                      required
                                      label="Music Name"
                                      className={classes.textField}
                                      value={item.title || ''}
                                      onChange={event => this.handleTitleChange(event, index)}
                                      margin="normal" />
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                      <TextField
                                        required
                                        type="number"
                                        label="Hour"
                                        className={classes.textFieldTime}
                                        value={item.hour || ''}
                                        onChange={event => this.handleDurationChange(event, index, 'h')}
                                        margin="normal" />
                                      <TextField
                                        required
                                        type="number"
                                        label="Minute"
                                        className={classes.textFieldTime}
                                        value={item.minute || ''}
                                        onChange={event => this.handleDurationChange(event, index, 'm')}
                                        margin="normal" />
                                      <TextField
                                        required
                                        type="number"
                                        label="Second"
                                        className={classes.textFieldTime}
                                        value={item.second || ''}
                                        onChange={event => this.handleDurationChange(event, index, 's')}
                                        margin="normal" />
                                    </div>
                                    <ListItemText primary={item.name} secondary={`Size: ${item.size}`} />
                                    <ListItemText primary={`Duration: ${this.msToHMS(item.duration)}`} secondary={`${item.duration} milis`} />
                                  </div>
                                </ListItem>
                                <Divider />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </List>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(useStyles, { withTheme: true })(MusicDialog)
