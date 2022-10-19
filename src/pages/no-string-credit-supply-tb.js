import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import React, {useEffect, useState} from 'react';
// material
import {
    Avatar,
    Card,
    Checkbox,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography
} from '@mui/material';
// components
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../sections/@dashboard/user';
import Methods from "../utils/utilities";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function MyTable(props) {
    const [page, setPage] = useState(0);
    const [list, setList] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('Date');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const edittedTableHead = (tbh) => {
        return tbh.filter((item) => {
            return item.id !== "Image"
        })
    };

    useEffect(() => {
        setList(props.list);
        setTableHead(props.tableHead);
    }, [props]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = list.map((n) => n._id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;

    const filteredUsers = applySortFilter(list, getComparator(order, orderBy), filterName);


    const isUserNotFound = filteredUsers.length === 0;

    return (

        <Card>
            <Scrollbar>
                <TableContainer sx={{minWidth: 800}}>
                    <Table className={"p-table"}>
                        <UserListHead
                            withoutCheck={true}
                            order={order}
                            orderBy={orderBy}
                            headLabel={edittedTableHead(tableHead)}
                            rowCount={list.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody className={"editted-items"}>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    const {_id, Id , Name, Price, Quantity, DeliveredQuantity, Units} = row;
                                    const isItemSelected = selected.indexOf(_id) !== -1;

                                    return (
                                        <TableRow
                                            hover
                                            key={_id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            aria-checked={isItemSelected}
                                        >
                                            <TableCell align="left"><input
                                                defaultValue={_id}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                type="text"
                                                disabled
                                                className="form-control"
                                                id=""
                                                placeholder={"Enter Id"}
                                            /></TableCell>
                                            <TableCell align="left"><input
                                                defaultValue={Name}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                type="text"
                                                disabled
                                                className="form-control"
                                                id=""
                                                placeholder={"Enter Name"}
                                            /></TableCell>
                                          <TableCell align="left"><input
                                                defaultValue={parseFloat(parseFloat(Quantity)-parseFloat(DeliveredQuantity))}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                type="text"
                                                disabled
                                                className="form-control"
                                                id=""
                                                placeholder={"Quantity"}
                                            /></TableCell>
                                          <TableCell align="left"><input
                                                defaultValue={Units}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                type="text"
                                                disabled
                                                className="form-control"
                                                id=""
                                                placeholder={"Units"}
                                            /></TableCell>
                                            <TableCell align="left"><input
                                                defaultValue={Price}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                type="text"
                                                disabled
                                                className="form-control"
                                                id=""
                                                placeholder={"Price"}
                                            /></TableCell>

                                            <TableCell align="left"><input
                                                defaultValue={DeliveredQuantity?parseFloat(parseFloat(Quantity)-parseFloat(DeliveredQuantity))*parseFloat(Price):0}
                                                // onChange={(e) => SetVaccineName(e.target.value)}
                                                type="text"
                                                disabled
                                                className="form-control"
                                                id=""
                                                placeholder={"Total"}
                                            /></TableCell>


                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: 53 * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                        {isUserNotFound && (
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                        <SearchNotFound searchQuery={filterName}/>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </TableContainer>
            </Scrollbar>

            <TablePagination
                rowsPerPageOptions={[25, 100, 100000]}
                component="div"
                count={list.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>

    );
}
