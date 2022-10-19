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
import Methods, {printElement, printInvoice} from "../utils/utilities";
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

export default function FinalProjectInvoice() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl, setViewId, invoice} = useContext(ShowAppDialogContext);
    const [site, setSite] = useState({})
    const [list, setList] = useState([]);
    const [myInvoice, setMyInvoice] = useState({});
    const [myTempInvoice, setTempMyInvoice] = useState({});
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
        console.log(invoice)
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${params.SiteId}`).then((response) => {
            setSite(response.data.info[0]);
            console.log(response.data.info[0])
        }).then(() => {
            axios.post("http://127.0.0.1:9000/api/invoice", invoice).then((response) => {
                console.log(response.data.info);
                switch (response.data.info.status) {
                    case "Exists":
                        console.log("Already exists");
                        setTempMyInvoice(response.data.info.invoice);
                        handleShowAppDialog(true);
                        break;
                    default:
                        setMyInvoice(response.data.info.invoice);
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

    const handleInvoiceChoice = () => {

    };

    const createNew = () => {
        axios.post("http://127.0.0.1:9000/api/invoice/proceed", invoice).then((response) => {
            setMyInvoice(response.data.info.invoice);
        })
        console.log("create New")
    };

    const createOld = () => {
        setMyInvoice(myTempInvoice);
        console.log("create Old")
    };

    return (
        <Page title={`${site.Name || "Invoices"} | NCPB`}>
            {showAppDialog ? (
                <AppChoiceDialog
                    title={`The items have been invoiced before`}
                    handleTextInput={handleInvoiceChoice}
                    createOld={createOld}
                    createNew={createNew}
                    component={
                        <Stack ml={3}>
                            <Card>
                                Click <b>YES</b> to print OLD Invoice
                            </Card>
                            <Card>
                                Click <b>NO</b> to proceed creating NEW Invoice
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
                            // to="FinalSupplyInvoice"
                            startIcon={<Iconify icon="uil:print"/>}
                            onClick={_print}
                            target={"NCPBEnterprisesLimited"}
                        >
                            Print
                        </Button>
                    </Box>
                </Stack>
                <Box className={"print-area"} sx={{height: "100%"}}>
                    <Stack height={"30px"} className={"top-header"} sx={{backgroundColor: "#3366ff"}} direction="row"
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
                            <Box className={"invoice-title"} sx={{display: "flex", flexDirection: "column"}} mr={2}>
                                <Typography variant="h2" className={"invoice-title-main"} gutterBottom>
                                    INVOICE
                                </Typography>

                                <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                    Invoice Number: #KI-{myInvoice.Id}
                                </Typography>
                                <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                    Date: {myInvoice.Date}
                                </Typography>
                            </Box>
                        </Stack>
                        <Box className={"box-basic-row"} direction="row" alignItems="center"
                             justifyContent="space-between" mb={3}>
                            <Box className={"bill-to-title-cont"} width={"55%"}>
                                <Stack className={"bill-to-title"} height={"20px"} sx={{backgroundColor: "#3366ff"}}
                                       pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        Bill To:
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myInvoice.ClientName}
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myInvoice.ClientBox}
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myInvoice.ClientLocation}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                        {/*<Box sx={{position: "absolute", top: "50%", left: "50%"}}>
                        <Watermark/>
                    </Box>*/}
                        <Box className={"other-comments-sct"} display="flex" justifyContent="space-between" mt={3}>
                            <Stack className={"other-comments-stack-left"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Stack className={"other-comments-stack-1"} mt={3} ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        LPO Number #: {myInvoice.LPONumber}
                                    </Typography>
                                </Stack>

                            </Stack>
                        </Box>
                        <Box className={"table-cont"} mr={3} mt={3}>
                            <Table mt={"10px"} className={"print-table"}>
                                <TableHead sx={{backgroundColor: "#3366ff"}} className={"print-table-head"}>
                                    <TableCell className={"print-th desc"} align="left" component="th" scope="row"
                                               >Description</TableCell>
                                    <TableCell className={"print-th"} align="left" component="th" scope="row"
                                               >Unit Price</TableCell>
                                    <TableCell className={"print-th"} align="right" component="th" scope="row"
                                               >Total</TableCell>
                                </TableHead>
                                <TableBody className={"print-tbody"}>
                                    {myInvoice.items ? myInvoice.items.map((row) => {
                                        return (
                                            <TableRow className={"print-tr"}>
                                                <TableCell className={"print-td desc"} align="left" component="td"
                                                           scope="row"
                                                           >{row.Name}</TableCell>
                                                <TableCell className={"print-td"} align="left" component="td"
                                                           scope="row"
                                                           >{Methods.numberWithCommas(parseFloat(row.Price).toFixed(2))}</TableCell>
                                                <TableCell className={"print-td"} align="right" component="td"
                                                           scope="row"
                                                           >{Methods.numberWithCommas(parseFloat(row.Total).toFixed(2) || 0)}</TableCell>
                                            </TableRow>
                                        )
                                    }) : null}
                                    

                                </TableBody>
                            </Table>

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
                                            {"Subtotal"}
                                        </Typography>
                                        <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <Box className={"other-comments-row-value"} minWidth="50%" display="flex"
                                         direction="row" alignItems="center"
                                         justifyContent="flex-end">
                                        <Typography variant="subtitle1" gutterBottom>
                                            {console.log(myInvoice.CashSubtotal)}
                                            Ksh {myInvoice.CashSubtotal ? Methods.numberWithCommas(parseFloat(myInvoice.CashSubtotal).toFixed(2)) : 0}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box className={"other-comments-row"} display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" mb={1} ml={3} mr={3}
                                >
                                    <Box className={"other-comments-row-field"} display="flex" direction="row"
                                         alignItems="center"
                                         justifyContent="space-between"
                                         width="80px" ml={1}>
                                        <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                            {"VAT Tax"}({myInvoice.CashVATPerc}%)
                                        </Typography>
                                        <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <Box className={"other-comments-row-value"} minWidth="50%" display="flex"
                                         direction="row" alignItems="center"
                                         justifyContent="flex-end">
                                        <Typography variant="subtitle1" gutterBottom>
                                            Ksh {myInvoice.CashVAT ? (Methods.numberWithCommas(parseFloat(myInvoice.CashVAT).toFixed(2))) : 0}
                                        </Typography>
                                    </Box>
                                </Box>
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
                                            Ksh {myInvoice.CashTotal ? Methods.numberWithCommas(parseFloat(myInvoice.CashTotal).toFixed(2)) : 0}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                            </Box>
                        <Stack mb={0} mt={8} ml={3} display={"flex"} direction="column" className={"print-item-names"}>

                            <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                PIN: P051198776T
                            </Typography>
                            <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                VAT: 0169534Z
                            </Typography>
                        </Stack>
                        <Stack mb={0} mb={5} ml={3} display={"flex"} justifyContent={"center"}  direction="column" className={"print-item-names centered"}>
                            <Typography className={"subtitle2"} variant="h5" gutterBottom>

                            Amount due on Demand
                            </Typography>
                        </Stack>


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
