import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import React, {useEffect, useState} from 'react';
// material
import {
    Avatar,
    Card,
    Box,
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
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../../sections/@dashboard/user';
import Methods from "../../utils/utilities";
import TableHead from "@mui/material/TableHead";

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

function getCmps(items) {
    let cmp = []
    for (let i in items) {
        cmp.push(<TableCell key={1} sx={{ border: 1 }} align="left" padding="none" className={"print-td"}>{items[i].startTime}</TableCell>)
        cmp.push(<TableCell key={2} sx={{ border: 1 }} align="left" padding="none" className={"print-td"}>{items[i].endTime}</TableCell>)
    }
    return cmp
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        let arr = [];
        for (let i = 0; i < array.length; i++) {
            for (let x in array[i]) {
                if (array[i][x].toString().toLowerCase().indexOf(query.toLowerCase())>-1){
                    arr.push(array[i]);
                    break;
                }
            }
        }
        // return filter(array, (_user) => {
        //
        //     _user.Date.toLowerCase().indexOf(query.toLowerCase()) !== -1
        // });

        return arr;
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function Tb(props) {
    const [page, setPage] = useState(0);
    const [list, setList] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    const [timeTableHead, setTimeTableHead] = useState([]);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('P/No');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(1000);

    const edittedTableHead = (tbh) => {
        return tbh.filter((item) => {
            return item.id !== "Image"
        })
    };

    useEffect(() => {
        setList(props.list);
        console.log(props.timeTableHead)
        setTableHead(props.tableHead);
        setTimeTableHead(props.timeTableHead);
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
            <UserListToolbar
                searchName="User"
                selected={selected}
                deleteSelected={props.deleteFunction}
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
            />

            <Scrollbar>
                <TableContainer sx={{minWidth: 800}}>
                    <Table className={"print-table table-cont"}>
                        {/*<UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={[{label: '', id: '', alignRight:false},{label: '', id: '', alignRight:false}, ...(tableHead)]}
                            rowCount={list.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />*/}
                        <UserListHead
                            order={order}
                            orderBy={orderBy}
                            secondLabel={(tableHead)}
                            headLabel={edittedTableHead(timeTableHead)}
                            rowCount={list.length}
                            numSelected={selected.length}
                            onRequestSort={handleRequestSort}
                            onSelectAllClick={handleSelectAllClick}
                        />
                        <TableBody className={"print-table-head"}>
                            {filteredUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    const {_id, Date, Name, Time, items, Variance, Amount, ThumbUrl} = row;
                                    const isItemSelected = selected.indexOf(_id) !== -1;

                                    return (
                                        <TableRow
                                            hover
                                            key={_id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            aria-checked={isItemSelected}
                                            className={"print-tr"}
                                            sx={{ border: 1 }}
                                        >
                                            <TableCell padding="checkbox" sx={{ border: 1 }}>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    onChange={(event) => handleClick(event, _id)}
                                                />
                                            </TableCell>
                                            <TableCell align="left" padding="none" sx={{ border: 1 }}
                                                       className={"print-td"}>{row["p/No"]}</TableCell>
                                            <TableCell align="left" padding="none" sx={{ border: 1 }}
                                                       className={"print-td"}>{Name}</TableCell>
                                            {getCmps(items)}
                                            <TableCell align="left" padding="none" sx={{ border: 1 }}
                                                       className={"print-td"}>{40}</TableCell>
                                            <TableCell align="left" padding="none" sx={{ border: 1 }}
                                                       className={"print-td"}>{Variance}</TableCell>

                                            <TableCell align="right">
                                                <UserMoreMenu  viewFunction={props.viewFunction} deleteFunction={props.deleteFunction} id={_id} editFunction = {props.editFunction}/>
                                            </TableCell>
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
                rowsPerPageOptions={[25, 100, 1000, 100000]}
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
