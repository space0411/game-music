import React from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableHead, TableRow, TableSortLabel, Checkbox, Tooltip } from '@material-ui/core';
import { HeadStyle } from './HeadKey';

const rowsProduct = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'idGame', numeric: true, disablePadding: false, label: 'GameID' },
    { id: 'releaseDate', numeric: true, disablePadding: false, label: 'Release Date' },
    { id: 'createdBy', numeric: true, disablePadding: false, label: 'Created By' },
    { id: 'numberOfFile', numeric: true, disablePadding: false, label: 'Number Of File' },
    { id: 'view', numeric: true, disablePadding: false, label: 'Number Of View' },
    { id: 'publish', numeric: false, disablePadding: false, label: 'Publish' },
    { id: 'options', numeric: true, disablePadding: false, label: '' },
];

const rowsFlatform = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'options', numeric: true, disablePadding: false, label: '' },
];

const rowsGame = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'idDeveloper', numeric: false, disablePadding: true, label: 'Id Developer' },
    { id: 'createdBy', numeric: false, disablePadding: true, label: 'createdBy' },
    { id: 'releaseDate', numeric: false, disablePadding: true, label: 'Release Date' },
    { id: 'options', numeric: true, disablePadding: false, label: '' },
];

const rowsDeveloper = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'image', numeric: false, disablePadding: true, label: 'Image' },
    { id: 'url', numeric: false, disablePadding: true, label: 'Url' },
    { id: 'options', numeric: true, disablePadding: false, label: '' },
];

const rowsMusic = [
    { id: 'id', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'type', numeric: false, disablePadding: true, label: 'Type' },
    { id: 'url', numeric: false, disablePadding: true, label: 'Url' },
    { id: 'options', numeric: true, disablePadding: false, label: '' },
];

export default class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    rows = []

    constructor(props) {
        super(props)
        const headStyle = this.props.headStyle
        switch (headStyle) {
            case HeadStyle.Product: this.rows = [...rowsProduct]
                break
            case HeadStyle.Flatform: this.rows = [...rowsFlatform]
                break
            case HeadStyle.Game: this.rows = [...rowsGame]
                break
            case HeadStyle.Developer: this.rows = [...rowsDeveloper]
                break
            case HeadStyle.Music: this.rows = [...rowsMusic]
                break
            default: break
        }
    }

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {this.rows.map(
                        row => (
                            <TableCell
                                key={row.id}
                                align={row.numeric ? 'right' : 'left'}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};
