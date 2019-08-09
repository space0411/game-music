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

import { observer } from 'mobx-react';
import { observable } from 'mobx';
import UploadMusicDialog from './UploadMusicDialog';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

const grid = 8;

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
  background: isDraggingOver ? "lightblue" : "lightgrey",
});

@observer
class MusicDialog extends React.Component {
  @observable musics = []
  @observable openUploadFile = false

  handleCloseUploadMusic = () => {
    this.openUploadFile = false
  }

  handleMusicFileChange = (files) => {
    const myMusics = [...this.musics, ...files]
    this.musics = myMusics.map((value, index) => value.id ? value : Object.assign(value, { id: `item-${index}` }))
    console.log(this.musics)
  }

  handleOpenUpload = () => {
    this.openUploadFile = true
  }

  handleTitleChange = (event, myindex) => {
    this.musics = this.musics.map((value, index) => index === myindex ? Object.assign(value, { title: event.target.value }) : value)
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
            <DragDropContext onDragEnd={this.onDragEnd}>
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
                                    <ListItemText primary={item.name} secondary={`Size: ${item.size}`} />
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
