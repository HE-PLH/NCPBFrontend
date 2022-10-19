// material
import {Box, Card, Grid, Container, Typography, Avatar, Stack, Button} from '@mui/material';
// components
import Page from '../components/Page';
import {
    AppTasks,
    AppNewUsers,
    AppBugReports,
    AppItemOrders,
    AppNewsUpdate,
    AppWeeklySales,
    AppOrderTimeline,
    AppCurrentVisits,
    AppWebsiteVisits,
    AppTrafficBySite,
    AppCurrentSubject,
    AppConversionRates
} from '../sections/@dashboard/app';
import React, {useContext, useEffect, useState} from "react";
import {RoleContext, ShowAppDialogContext} from "../components/contexts/contexts";
import axios from "axios";

const {v4} = require("uuid");
import {useParams} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../components/Iconify";
import AlertDialog from "../components/AppDialog/AppDialog";
import RegisterItemForm from "../components/registerItem";
import MyTable from "./no-string-supply-tb";
import Methods, {printElement, printCredit, printInvoice} from "../utils/utilities";
import LogoHead from "../components/LogoHead";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Logo from "../components/Logo";
import Watermark from "../components/Watermark";
import LogoWaterhead from "../components/LogoWaterhead";
import AppChoiceDialog from "../components/AppChoiceDialog/AppDialog";

// ----------------------------------------------------------------------

export default function FinalSupplyCreditNote() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl, setViewId, credit} = useContext(ShowAppDialogContext);
    const [site, setSite] = useState({})
    const [list, setList] = useState([]);
    const [myCredit, setMyCredit] = useState({});
    const [myTempCredit, setTempMyCredit] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [VAT, setVAT] = useState(0);
    const [discount, setDiscount] = useState(0);

    const params = useParams();

    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Total', label: 'Total', alignRight: false},
    ]);

    useEffect(() => {
        console.log(credit)
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${params.SiteId}`).then((response) => {
            setSite(response.data.info[0]);
            console.log(response.data.info[0])
        }).then(() => {
            axios.post("http://127.0.0.1:9000/api/credit", credit).then((response) => {
                console.log(response.data.info);
                switch (response.data.info.status) {
                    case "Exists":
                        console.log("Already exists");
                        setTempMyCredit(response.data.info.credit);
                        handleShowAppDialog(true);
                        break;
                    default:
                        setMyCredit(response.data.info.credit);
                }
            })
        })

    }, [])

    const sumOfItems = (lst) => {
        let sum = 0;
        if (lst.length > 0) {
            for (let i = 0; i < lst.length; i++) {
                sum += parseFloat(lst[i].Quantity) * parseFloat(lst[i].Price)
            }
        }
        return sum;

    };

    const _print = () => {
        printInvoice(document.querySelector(".print-area"))
    };

    const handleCreditChoice = () => {

    };

    const createNew = () => {
        axios.post("http://127.0.0.1:9000/api/credit/proceed", credit).then((response) => {
                setMyCredit(response.data.info.credit);
            })
        console.log("create New")
    };

    const createOld = () => {
        setMyCredit(myTempCredit);
        console.log("create Old")
    };

    return (
        <Page title={`${site.Name || "Credits"} | NCPB`}>
            {showAppDialog ? (
                <AppChoiceDialog
                    title={`The items have been creditd before`}
                    handleTextInput={handleCreditChoice}
                    createOld={createOld}
                    createNew={createNew}
                    component={
                        <Stack ml={3}>
                            <Card>
                                Click <b>YES</b> to print OLD Credit
                            </Card>
                            <Card>
                                Click <b>NO</b> to proceed creating NEW Credit
                            </Card>
                            <Card>
                                Click <b>CANCEL</b> to escape
                            </Card>
                        </Stack>
                    }
                />
            ) : null}
            <Box ml={1} mr={1} maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h6" gutterBottom>

                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            // component={RouterLink}
                            sx={{"marginRight": "10px"}}
                            // to="FinalSupplyCredit"
                            startIcon={<Iconify icon="uil:print"/>}
                            onClick={_print}
                            target={"NCPBEnterprisesLimited"}
                        >
                            Print
                        </Button>
                    </Box>
                </Stack>
                <Box className={"print-area"} sx={{height: "100%"}}>
                    <Stack height={"30px"} className={"top-header"} sx={{backgroundColor: "#00f", color: "white"}} direction="row"
                           alignItems="center" mt={2}>

                    </Stack>
                    <Stack className={"logohead-watermark"} mb={0} mt={3} display={"flex"} direction="row"
                           alignItems="center"
                           justifyContent="center" sx={{
                        backgroundColor: "transparent",
                        width: "400px",
                        height: "400px",
                        position: "absolute",
                        top: "18%",
                        left: "25%",
                        zIndex: 0.3,
                        opacity: 0.3
                    }}>
                        <LogoWaterhead/>
                    </Stack>
                    <Box className={"item-container"} sx={{zIndex: 3, width: "95%", position: "absolute"}}>
                        <Stack direction="row" className={"print-top-row"} alignItems="center"
                               justifyContent="space-between" mb={1}>
                            <LogoHead/>
                            <Box className={"credit-title"} sx={{display: "flex", flexDirection: "column"}} mr={2}>
                                <Typography variant="h2" className={"credit-title-main"} gutterBottom>
                                    CREDIT NOTE
                                </Typography>

                                <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                    Credit Note#: #KI-{myCredit.Id}
                                </Typography>
                                <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                    Date: {myCredit.Date}
                                </Typography>
                            </Box>
                        </Stack>
                        <Box className={"box-basic-row"} direction="row" alignItems="center"
                             justifyContent="space-between" mb={3}>
                            <Box className={"bill-to-title-cont"} width={"55%"}>
                                <Stack className={"bill-to-title"} height={"20px"} sx={{backgroundColor: "#00f", color: "white"}}
                                       pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        Bill To:
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myCredit.ClientName}
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myCredit.ClientBox}
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myCredit.ClientLocation}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                        <Box className={"other-comments-sct"} display="flex" justifyContent="space-between" mt={3}>
                            <Stack className={"other-comments-stack-left"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Stack className={"other-comments-stack-1"} mt={3} ml={3}>

                                </Stack>
                                <Stack className={"other-comments-stack-1"} mt={3} ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        Invoice Number #: {1001}
                                    </Typography>
                                </Stack>

                            </Stack>

                        </Box>
                        {/*<Box sx={{position: "absolute", top: "50%", left: "50%"}}>
                        <Watermark/>
                    </Box>*/}
                        <Box className={"table-cont"} mr={3} mt={3}>
                            <Table mt={"10px"} className={"print-table"}>
                                <TableHead sx={{backgroundColor: "#00f", color: "white"}} className={"print-table-head"}>
                                    <TableCell className={"print-th"} align="left" component="th" scope="row"
                                               padding="none">Description</TableCell>
                                    <TableCell className={"print-th"} align="right" component="th" scope="row"
                                               padding="none">Price</TableCell>
                                    <TableCell className={"print-th"} align="right" component="th" scope="row"
                                               padding="none">Total</TableCell>
                                </TableHead>
                                <TableBody className={"print-tbody"}>
                                    {myCredit.items ? myCredit.items.map((row) => {
                                        return (
                                            <TableRow className={"print-tr"}>
                                                <TableCell className={"print-td"} align="left" component="td"
                                                           scope="row"
                                                           padding="none">{row.Name}</TableCell>
                                                <TableCell className={"print-td"} align="right" component="td"
                                                           scope="row"
                                                           padding="none">{Methods.numberWithCommas(row.Price)}</TableCell>
                                                <TableCell className={"print-td"} align="right" component="td"
                                                           scope="row"
                                                           padding="none">{Methods.numberWithCommas(row.Total || 0)}</TableCell>
                                            </TableRow>
                                        )
                                    }) : null}
                                </TableBody>
                            </Table>
                        </Box>
                        <Box className={"other-comments"} display="flex" justifyContent="space-between" mt={3}>
                            <Stack className={"other-comments-stack-left"} direction="column" width="40%"
                                   maxWidth="400px">

                            </Stack>
                            <Stack className={"other-comments-stack-right"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Box className={"other-comments-row"} display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" mb={1} ml={3} mr={3}
                                >
                                    <Box className={"other-comments-row-field"} display="flex" direction="row"
                                         alignItems="center"
                                         justifyContent="space-between"
                                         width="80px" ml={1}>
                                        <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                            {"Total"}
                                        </Typography>
                                        <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <Box className={"other-comments-row-value"} minWidth="50%" display="flex"
                                         direction="row" alignItems="center"
                                         justifyContent="flex-end">
                                        <Typography variant="subtitle1" gutterBottom>
                                            Ksh {myCredit.CashSubtotal ? Methods.numberWithCommas(myCredit.CashSubtotal) : 0}
                                        </Typography>
                                    </Box>
                                </Box>

                            </Stack>
                        </Box>

                    </Box>
                    <Stack className={"print-bottom-box"} mb={0} mt={3} display={"flex"} direction="row"
                           alignItems="center"
                           justifyContent="center" sx={{backgroundColor: "transparent", width: "100%", height: "30px"}}>

                    </Stack>
                </Box>

            </Box>
        </Page>
    );
}
