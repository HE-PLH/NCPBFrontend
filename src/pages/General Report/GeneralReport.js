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

import DailyPettyCashSummaryTable from "./tb";
import AlertDialog from "../../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../../components/contexts/contexts";
import axios from 'axios'
import RegisterItemForm from "../../components/registerItem";
import Box from "@mui/material/Box";
import Methods, {printElement} from "../../utils/utilities";
import DatePickerComponent from "../datePicker";
import {
    AppBugReports,
    AppItemOrders,
    AppNewUsers,
    AppTrafficBySite,
    AppWeeklySales
} from "../../sections/@dashboard/app";
import PettyExpenses from "../../sections/@dashboard/pettyInstantViews/PettyExpenses";
import PettyMoneyIn from "../../sections/@dashboard/pettyInstantViews/PettyMoneyIn";
import Balance from "../../sections/@dashboard/pettyInstantViews/Balance";
import TotalExpenses from "../../sections/@dashboard/reportShows/TotalExpenses";
import TotalIncome from "../../sections/@dashboard/reportShows/TotalIncome";
import Profit from "../../sections/@dashboard/reportShows/Profit";
import Invoices from "../../sections/@dashboard/reportShows/AppBugReports";
import SingleReportItem from "../../sections/@dashboard/reportShows/SingleReportItems";

// ----------------------------------------------------------------------


export default function GeneralReport(props) {
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, advancedSelectValue, setAdvancedSelectValue, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [expenses, setExpenses] = useState(0);
    const [invoices, setInvoices] = useState(0);
    const [moneyIn, setMoneyIn] = useState(0);
    const [balance, setBalance] = useState(0);

    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([
        {id: 'Date', label: 'Date', alignRight: false},
        {id: 'Target', label: 'Target', alignRight: false},
        {id: 'Description', label: 'Description', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Unit Price', label: 'Unit Price', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Balances', label: 'Balances', alignRight: false},
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
            axios.post("http://127.0.0.1:9000/api/getGeneralReport", {
                Start_date: (dates.startDate).toLocaleDateString(),
                End_date: (dates.endDate).toLocaleDateString()
            }).then((response) => {
                console.log(response.data.info)
                let res = [];
                setBalance((response.data.info.InvoicePaymentSum - response.data.info.InvoiceExpensesSum).toFixed(2));
                setExpenses(response.data.info.InvoiceExpensesSum.toFixed(2));
                setInvoices(response.data.info.InvoiceExpensesCount);
                setMoneyIn((response.data.info.InvoicePaymentSum).toFixed(2));
                // let parent = response.data.info.Merged;
                let _target = "";
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
                setList(res);
            }) : null
    }

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".petty-print"))
    }

    const viewItem = (_id) => {
        // setViewId(_id);
        navigate(`/IndividualSupplyView/${_id}`)

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
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        General Summaries
                    </Typography>
                    <Box>
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
                            Print Table
                        </Button>
                    </Box>

                </Stack>

                <Box sx={{position: "relative"}} mb={1}>
                    <DatePickerComponent setParentState={setParentState}/>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TotalExpenses Expenses={expenses}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TotalIncome income={moneyIn}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Profit profit={balance}/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Invoices invoices={invoices}/>
                    </Grid>
                </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
            <SingleReportItem dates={dates}/>
          </Grid>


                {/*<DailyPettyCashSummaryTable list={list} tableHead={table_head} viewFunction={(e) => {
                    viewItem(e)
                }}/>*/}
                </Box>
            </Box>
        </Card>
    );
}



