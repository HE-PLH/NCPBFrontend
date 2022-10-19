import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import RegisterUserForm from "../../components/registerUser";
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination, Grid
} from '@mui/material';

const {v4} = require("uuid");
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../../sections/@dashboard/user';

import MyTable from "./tb";
import AlertDialog from "../../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../../components/contexts/contexts";
import axios from 'axios'
import RegisterItemForm from "../../components/registerItem";
import Box from "@mui/material/Box";
import Methods, {printElement} from "../../utils/utilities";
import DatePickerComponent from "../datePicker";
import LogoHead from "../../components/LogoHead";

// ----------------------------------------------------------------------


export default function LateInAndEarlyOut(props) {
    const navigate = useNavigate();
    const {
        showAppDialog,
        showEditDialog,
        advancedSelectValue,
        setAdvancedSelectValue,
        handleShowAppDialog,
        handleEditDialog,
        uploadedImage,
        uploadedThumbUrl
    } = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [expenses, setExpenses] = useState(0);
    const [moneyIn, setMoneyIn] = useState(0);
    const [balance, setBalance] = useState(0);

    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([]);
    const [time_table_head, setTimeTableHead] = useState([
        {id: 'P/No', label: 'P/No', alignRight: false},
        {id: 'Name', label: 'Name', alignRight: false}
    ]);

    const [listUpdate, setListUpdate] = useState(false);

    const handleAddUser = () => {
        console.log("click");
        handleShowAppDialog();
    };


    const setUser = () => {

    };

    const [dates, setDates] = useState({});

    const setParentState = (_dates) => {
        console.log(_dates[0]);
        setDates(_dates[0])
    }

    useEffect(() => {
        setListUpdate(!listUpdate);
    }, []);

    useEffect(() => {
        onDatesChange();
    }, [listUpdate]);

    useEffect(() => {
        onDatesChange();
    }, [dates])


    const sumOfItems = (lst, field, type, adjacent) => {
        let sum = 0;
        if (lst.length > 0) {
            for (let i = 0; i < lst.length; i++) {
                if (lst[i]["Type"] === type) {
                    if (lst[i][adjacent]) {
                        sum += parseFloat(lst[i][field]) * parseFloat(lst[i][adjacent])
                    } else {
                        sum += parseFloat(lst[i][field])
                    }

                }
            }
        }
        return sum;
    };

    function onDatesChange() {
        dates.startDate ?
            axios.post("http://127.0.0.1:9000/api/lieo", {
                Start_date: (dates.startDate).toLocaleDateString(),
                End_date: (dates.endDate).toLocaleDateString()
            }).then((response) => {

                let timeTableHead = [{id: 'P/No', label: 'P/No', alignRight: false},
                    {id: 'Name', label: 'Name', alignRight: false}];
                let th = []
                for (let i in response.data.info.table_head) {
                    let temp = {};
                    temp['id'] = i;
                    temp['label'] = i;
                    temp['alignRight'] = false;
                    th.push(temp);
                }
                for (let i in response.data.info.table_head) {
                    let temp = {};

                    temp['id'] = "Time In";
                    temp['label'] = "Time In";
                    temp['alignRight'] = false;
                    timeTableHead.push(temp);
                    temp = {};
                    temp['id'] = "Time Out";
                    temp['label'] = "Time Out";
                    temp['alignRight'] = false;
                    timeTableHead.push(temp);
                }

                let temp = {};
                temp['id'] = "Hrs/Wk";
                temp['label'] = "Hrs/Wk";
                temp['alignRight'] = false;
                timeTableHead.push(temp);

                temp = {};
                temp['id'] = "Variance";
                temp['label'] = "Variance";
                temp['alignRight'] = false;
                timeTableHead.push(temp);

                setTableHead(th);
                setTimeTableHead(timeTableHead);

                for (let i = 0; i < response.data.info.groups.length; i++) {
                    let temp_items = [];
                    for (let thKey in response.data.info.table_head) {
                        let flag = false;
                        for (let j = 0; j < response.data.info.groups[i].items.length; j++) {
                            if (thKey === response.data.info.groups[i].items[j].Date) {
                                flag = true;
                                temp_items.push(response.data.info.groups[i].items[j])
                                break;
                            }
                        }

                        if (!flag) {
                            temp_items.push({
                                startTime: "",
                                Date: thKey,
                                endTime: ""
                            })
                        }
                    }
                    response.data.info.groups[i].items = temp_items;
                }
                // let res = [];
                // setBalance(response.data.info.PettyCashPaymentSum - response.data.info.allExpenses);
                // setExpenses(response.data.info.allExpenses);
                // setMoneyIn(response.data.info.PettyCashPaymentSum);
                // let parent = response.data.info.Merged;
                // let _target = "";
                // for (let i in parent) {
                //     if (parent.hasOwnProperty(i)) {
                //         let temp = {};
                //         temp["_id"] = i;
                //         temp["Date"] = i;
                //         temp["Items"] = parent[i];
                //
                //         let expenses = sumOfItems(temp["Items"], "Amount", "Expenses");
                //         let m_in = sumOfItems(temp["Items"], "Amount", "Money In", "Quantity");
                //
                //         for (let j = 0; j < temp["Items"].length; j++) {
                //             if (temp["Items"][j]["Target"]===_target){
                //                 temp["Items"][j]["Target"]=""
                //             }else{
                //                 _target = temp["Items"][j]["Target"];
                //                 console.log(_target)
                //             }
                //         }
                //
                //         temp.DailyReport = {
                //             used: expenses,
                //             gained: m_in,
                //             dayBalance: m_in - expenses
                //         };
                //         res.push(temp);
                //     }
                // }
                setList(response.data.info.groups);
            }) : null
    }

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".petty-print"))
    }

    function sync(e) {
        console.log("syncing...");
        axios.get("http://127.0.0.1:9000/api/logs").then((response) => {
            alert(response.data.info);
        })
    }

    const viewItem = (_id) => {
        // setViewId(_id);
        navigate(`/IndividualUserView/${_id}`)

    };
    const generateInvoice = (_id) => {
        // setViewId(_id);
        console.log("here")
        navigate(`/ProjectView/SuppliesInvoice/${_id}`)

    };

    return (
        <Card>
            <Box ml={1} mr={1}>
                <Box className={"petty-print"}>
                    <Stack direction="row" alignItems="center" className={"no-appearance"} justifyContent="space-between" mb={1}>
                        <Typography variant="h4" gutterBottom>
                            Late In And Early Out Report
                        </Typography>
                        <Box>
                            <Button
                                variant="contained"
                                sx={{"marginRight": "10px"}}
                                startIcon={<Iconify icon="ion:reload-circle-sharp"/>}
                                onClick={sync}
                            >
                                SYNC
                            </Button>
                            <Button
                                variant="outlined"
                                component={RouterLink}
                                sx={{"marginRight": "10px"}}
                                to="#"
                            >
                                {dates.startDate ? Methods.formatDate(dates.startDate) : ""}
                            </Button>
                            <Button
                                variant="outlined"
                                component={RouterLink}
                                to="#"
                            >
                                {dates.endDate ? Methods.formatDate(dates.endDate) : ""}
                            </Button>
                            <Button
                                variant="outlined"
                                component={RouterLink}
                                sx={{"marginRight": "10px"}}
                                to="#"
                                startIcon={<Iconify icon="uil:print"/>}
                                onClick={_print}
                            >
                                Print Report
                            </Button>
                        </Box>

                    </Stack>

                    <Box sx={{position: "relative"}} className={"no-appearance"} mb={1}>
                        <DatePickerComponent setParentState={setParentState}/>
                    </Box>

                    {/*<Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <PettyExpenses Expenses={expenses}/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <PettyMoneyIn MoneyIn={moneyIn}/>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Balance Balance={balance}/>
                        </Grid>
                    </Grid>*/}
                    <Stack direction="row" className={"print-top-row"} alignItems="center"
                           justifyContent="space-between" mb={1}>
                        <LogoHead/>
                        <Box className={"invoice-title"} sx={{display: "flex", flexDirection: "column"}} mr={2}>

                        </Box>
                    </Stack>
                    <Stack direction="row" className={"print-top-row centered"} alignItems="center"
                           justifyContent="center" mb={1}>
                        <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                WEEKLY LATE IN AND EARLY OUT ATTENDANCE REPORT FOR HEAD OFFICE STAFF
                            </Typography>
                    </Stack>

                    <MyTable list={list} tableHead={table_head} timeTableHead={time_table_head}
                                                viewFunction={(e) => {
                                                    viewItem(e)
                                                }}/>
                </Box>
            </Box>
        </Card>
    );
}



