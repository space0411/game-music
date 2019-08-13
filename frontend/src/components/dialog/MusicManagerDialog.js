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

import PropTypes from 'prop-types';
import {
  Table, TableBody, TableCell, TablePagination, TableRow,
  Paper, Checkbox
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import EnhancedTableHead from '../table/EnhancedTableHead';
import EnhancedTableToolbar from '../table/EnhancedTableToolbar';
import AlertDialog from './AlertDialog';
import EditDialog from './EditDialog';
import { HeadStyle } from '../table/HeadKey';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

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
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
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

@inject('SessionStore', 'ScreenStore')
@observer
class MusicManagerDialog extends React.Component {
  @observable data = []
  @observable openUploadFile = false
  @observable openAlert = false
  @observable openEditAlert = false
  @observable alert = {
    title: 'Alert',
    content: 'Do you want delete ?'
  }

  @observable alertEdit = {
    title: 'Edit',
    content: 'Fill a name for edit'
  }
  state = {
    order: 'desc',
    orderBy: 'id',
    selected: [],
    page: 0,
    rowsPerPage: 10,
  };

  handleCloseUploadMusic = () => {
    this.openUploadFile = false
  }

  handleMusicFileChange = (files) => {
    const myMusics = [...this.data, ...files]
    this.data = myMusics.map((value, index) => value.id ? value : Object.assign(value, { id: `item-${index}` }))
    console.log(this.data)
  }

  handleOpenUpload = () => {
    this.openUploadFile = true
  }

  handleTitleChange = (event, myindex) => {
    this.data = this.data.map((value, index) => index === myindex ? Object.assign(value, { title: event.target.value }) : value)
    resetServerContext()
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.data,
      result.source.index,
      result.destination.index
    )
    this.data = items
    console.log(this.data)
  }

  handleUploadMusic = () => {
    const { openAlertDialog, productData } = this.props
    console.log('handleUploadMusic', this.data.length, productData)
    if (productData.id && this.data.length > 0) {
      var data = new FormData()
      var musicData = []
      this.data.forEach(file => {
        data.append('file', file)
        musicData.push({ name: file.title })
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

  componentDidMount() {
    const productData = this.props.ScreenStore.editEventData
    const { openAlertDialog } = this.props
    console.log(productData)
    if (!productData)
      return
    fetch(`${this.props.SessionStore.API_URL}music/read`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.SessionStore.getUserToken()}`
      },
      body: JSON.stringify({ idProduct: productData.id })
    }).then((result) => {
      return result.json();
    }).then((jsonResult) => {
      console.log(jsonResult);
      if (jsonResult.success)
        this.data = jsonResult.data.list
      else
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: this.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleEditClick = (item) => {
    const data = {
      id: item.id,
      name: item.name
    }
    this.alertEdit = { ...this.alertEdit, ...data }
    this.openEditAlert = true
  }

  handleDeleteClick = (item) => {
    this.alert = {
      title: 'Alert',
      content: `Do you want delete product "${item.name}" with id=${item.id} ?`
    }
    this.productId = item.id
    this.openAlert = true
  }

  handleAlertClose = () => {
    this.openAlert = false
  }

  handleEditAlertClose = () => {
    this.openEditAlert = false
  }

  handleAgreeDelete = () => {
    this.openAlert = false
    this.deleteFlatform(this.productId)
  }

  handleAgreeEdit = (name, id) => {
    console.log(name, id)
    this.openEditAlert = false
    this.editFlatform(name, id)
  }

  render() {
    const { classes, open, handleClose } = this.props
    const data = this.data;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
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
                Music
              </Typography>
              {/* <Button variant="contained" color="secondary" onClick={this.handleOpenUpload} aria-label="Select music">
                <NoteAddIcon />Select Music
              </Button>
              <Button style={{ marginLeft: 8 }} variant="contained" color="secondary" onClick={this.handleUploadMusic} aria-label="Upload music">
                <CloudUploadIcon />Upload to server
              </Button> */}
            </Toolbar>
          </AppBar>
          {/* <List>
            <DragDropContext constantProp={this.data} onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.data.map((item, index) => {
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
                                      value={item.name || ''}
                                      onChange={event => this.handleTitleChange(event, index)}
                                      margin="normal" />
                                    <ListItemText primary={item.url} secondary={`Size: ${item.size}`} />
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
          </List> */}
          <div style={{ padding: 24 }}>
            <Paper className={classes.root}>
              <AlertDialog handleAgree={this.handleAgreeDelete} handleDisagree={this.handleAlertClose} handleClose={this.handleAlertClose} data={this.alert} open={this.openAlert} />
              <EditDialog handleClose={this.handleEditAlertClose} handleAgree={this.handleAgreeEdit} data={this.alertEdit} open={this.openEditAlert} />
              <EnhancedTableToolbar numSelected={selected.length} />
              <div className={classes.tableWrapper}>
                <Table className={classes.table} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    headStyle={HeadStyle.Music}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={this.handleSelectAllClick}
                    onRequestSort={this.handleRequestSort}
                    rowCount={data.length}
                  />
                  <TableBody>
                    {stableSort(data, getSorting(order, orderBy))
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(n => {
                        const isSelected = this.isSelected(n.id);
                        return (
                          <TableRow
                            hover
                            // onClick={event => this.handleClick(event, n.id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox onChange={() => this.handleClick(undefined, n.id)} checked={isSelected} />
                            </TableCell>
                            <TableCell component="th" scope="row" padding="none">{n.id}</TableCell>
                            <TableCell component="th" scope="row" padding="none">{n.name}</TableCell>
                            <TableCell component="th" scope="row" padding="none">{n.type}</TableCell>
                            <TableCell component="th" scope="row" padding="none">{n.url}</TableCell>
                            <TableCell align="right">
                              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <IconButton onClick={() => this.handleEditClick(n)} color="primary" className={classes.button} aria-label="Edit">
                                  <Edit />
                                </IconButton>
                                <IconButton onClick={() => this.handleDeleteClick(n)} color="secondary" className={classes.button} aria-label="Delete">
                                  <Delete />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 49 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[10, 20, 40]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page',
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </div>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(useStyles, { withTheme: true })(MusicManagerDialog)
