import PropTypes from 'prop-types';
// material
import {visuallyHidden} from '@mui/utils';
import {Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel} from '@mui/material';
import React from "react";

// ----------------------------------------------------------------------

UserListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    rowCount: PropTypes.number,
    headLabel: PropTypes.array,
    numSelected: PropTypes.number,
    onRequestSort: PropTypes.func,
    onSelectAllClick: PropTypes.func,
    withCheck: PropTypes.bool
};

export default function UserListHead({
                                         order,
                                         orderBy,
                                         rowCount,
                                         headLabel,
                                         secondLabel,
                                         numSelected,
                                         onRequestSort,
                                         onSelectAllClick,
                                         withoutCheck
                                     }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <TableHead className={"thead print-table-head"}>
            {
                secondLabel ?
                    <>
                        <TableRow className={"no-bd"}>

                            <TableCell>

                            </TableCell>
                            <TableCell>

                            </TableCell>
                            {secondLabel.map((headCell) => (
                                <TableCell colSpan={2}
                                           key={headCell.id}
                                           align={headCell.alignRight ? 'center' : 'center'}
                                           className={"print-th"}
                                           padding={"none"}
                                           sx={{border: 1}}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className={"no-bd"}>

                            <TableCell>

                            </TableCell>
                            <TableCell>

                            </TableCell>

                            {secondLabel.map((headCell) => (
                                <TableCell colSpan={2}
                                           key={headCell.id}
                                           align={headCell.alignRight ? 'center' : 'center'}
                                           className={"print-th"}
                                           padding={"none"}
                                           sx={{border: 1}}
                                >

                                    {days[new Date(headCell.label).getDay()]}
                                </TableCell>
                            ))}
                        </TableRow>
                    </> : null

            }
            <TableRow sx={{borderBottom: 1}} padding={"none"}>
                {!withoutCheck ?
                    <TableCell padding="checkbox" sx={{border: 1}} className={"no-appearance"}>
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell> : null}

                {headLabel.map((headCell) => (
                    <TableCell sx={{border: 1}}
                               key={headCell.id}
                               align={headCell.alignRight ? 'center' : 'center'}
                               sortDirection={orderBy === headCell.id ? order : false}
                               className={"print-th"}
                    >
                        <TableSortLabel
                            className={"special-print-th"}
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}

                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box sx={{...visuallyHidden}} className={"no-appearance"}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
