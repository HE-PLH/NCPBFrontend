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

export default function FinalJobCard() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl, setViewId, jobCard} = useContext(ShowAppDialogContext);
    const [site, setSite] = useState({})
    const [project, setProject] = useState({})
    const [list, setList] = useState([]);
    const [myJobCard, setMyJobCard] = useState({});
    const [myTempJobCard, setTempJobCard] = useState({});
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [VAT, setVAT] = useState(0);

    const params = useParams();

    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Total', label: 'Total', alignRight: false},
    ]);

    useEffect(() => {
        console.log(jobCard);
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${params.SiteId}`).then((response) => {
            setSite(response.data.info[0]);
            console.log(response.data.info[0])
        }).then(() => {
            axios.get(`http://127.0.0.1:9000/api/projects?_id=${params.Id}`).then((response) => {
                setProject(response.data.info[0]);
                console.log(response.data.info[0])
            })
        }).then(() => {
            axios.post("http://127.0.0.1:9000/api/jobCard", jobCard).then((response) => {
                console.log(response.data.info, response.data.info.status);
                switch (response.data.info.status) {
                    case "Exists":
                        console.log("Already exists");
                        setTempJobCard(response.data.info.jobCard);
                        handleShowAppDialog(true);
                        break;
                    default:
                        console.log(response.data.info.jobCard)
                        setMyJobCard(response.data.info.jobCard || {});
                    /* let up_ = [];
                     for (let i = 0; i < jobCard.items.length; i++) {
                         let temp = {};
                         temp["_id"] = jobCard.items[i].Id;
                         temp["InvoiceNumber"] = response.data.info.jobCard.Id;
                         up_.push(temp);
                     }*/
                    /*axios.post("http://127.0.0.1:9000/api/projectworks/update", up_).then((response) => {
                        console.log(response.data.info);
                    });*/
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

    const handleJobCardChoice = () => {

    };

    const createNew = () => {
        axios.post("http://127.0.0.1:9000/api/jobCard/proceed", jobCard).then((response) => {
            setMyJobCard(response.data.info.jobCard || {});
            return (response.data.info.jobCard)
        });
        console.log("create New")
    };

    const createOld = () => {
        setMyJobCard(myTempJobCard || {});
        console.log("create Old")
    };

    return (
        <Page title={`${site.Name || "Job Cards"} | NCPB`}>
            {showAppDialog ? (
                <AppChoiceDialog
                    title={`The items' jobCard has been generated before`}
                    handleTextInput={handleJobCardChoice}
                    createOld={createOld}
                    createNew={createNew}
                    component={
                        <Stack ml={3}>
                            <Card>
                                Click <b>YES</b> to print OLD Job Card
                            </Card>
                            <Card>
                                Click <b>NO</b> to proceed creating NEW Job Card
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
                            // to="FinalSupplyJob Card"
                            startIcon={<Iconify icon="uil:print"/>}
                            onClick={_print}
                            target={"NCPBEnterprisesLimited"}
                        >
                            Print
                        </Button>
                    </Box>
                </Stack>
                <Box className={"print-area"} sx={{height: "100%"}}>
                    <Stack height={"30px"} className={"top-header"} sx={{backgroundColor: "#00f"}} direction="row"
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
                            <Box className={"jobCard-title"} sx={{display: "flex", flexDirection: "column"}}>
                                <Typography variant="h2" className={"jobCard-title-main"} gutterBottom>
                                    JOB CARD
                                </Typography>
                                <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                    Date: {Methods.formatDate(new Date(myJobCard.Date))}
                                </Typography>
                            </Box>
                        </Stack>
                        <Box className={"box-basic-row"} direction="row" alignItems="center"
                             justifyContent="space-between" mb={3}>
                            <Box className={"bill-to-title-cont"} width={"55%"}>
                                <Stack className={"bill-to-title"} height={"20px"} sx={{backgroundColor: "#00f"}}
                                       pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        Client Information
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myJobCard.ClientName}
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myJobCard.ClientBox}
                                    </Typography>
                                </Stack>
                                <Stack ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {myJobCard.ClientLocation}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                        {/*<Box sx={{position: "absolute", top: "50%", left: "50%"}}>
                        <Watermark/>
                    </Box>*/}
                        <Box className={"other-comments-sct"} display="flex" justifyContent="space-between" mt={3}>
                            <Stack className={"other-comments-stack-right-x"} direction="column" width="60%"
                                   maxWidth="600px">
                                <Stack className={"bill-to-title"} height={"20px"} sx={{backgroundColor: "#00f"}}
                                       pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        Project
                                    </Typography>
                                </Stack>
                                <Stack className={"other-comments-stack-1"} mt={3} ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        {project?project.Name:""}
                                    </Typography>
                                </Stack>

                            </Stack>
                            <Stack className={"other-comments-stack-left"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Stack className={"other-comments-stack-1"} mt={3} ml={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        LPO Number #: {project?project.Id:""}
                                    </Typography>
                                </Stack>

                            </Stack>
                        </Box>
                        <Box className={"table-cont"} mr={3} mt={3}>
                            <Table mt={"10px"} className={"print-table"}>
                                <TableHead sx={{backgroundColor: "#00f"}} className={"print-table-head"}>
                                    <TableCell className={"print-th"} align="left" component="th" scope="row"
                                    >

                                    </TableCell>
                                    <TableCell className={"print-th"} align="left" component="th" scope="row"
                                    >DESCRIPTION</TableCell>
                                    <TableCell className={"print-th"} align="left" component="th" scope="row"
                                               padding="none">AMOUNT</TableCell>


                                </TableHead>
                                <TableBody className={"print-tbody"}>
                                    {myJobCard.items ? myJobCard.items.map((row, index) => {
                                        index++;
                                        return (
                                            <TableRow className={"print-tr"}>
                                                <TableCell className={"print-td"} align="left" component="td"
                                                           scope="row"
                                                           ml={3}
                                                >{index})</TableCell>
                                                <TableCell className={"print-td"} align="left" component="td"
                                                           scope="row"
                                                >{row.Name}</TableCell>
                                            </TableRow>
                                        )
                                    }) : null}
                                    <TableRow className={"print-tr"}>
                                        <TableCell className={"print-th"} align="left" component="th" scope="row">

                                        </TableCell>
                                        <TableCell className={"print-th"} align="right" component="th" scope="row">
                                            TOTAL
                                        </TableCell>
                                        <TableCell className={"print-th"} align="right" component="th" scope="row"
                                                   padding="none">
                                            Ksh {myJobCard.CashSubtotal ? Methods.numberWithCommas(parseFloat(myJobCard.CashSubtotal).toFixed(2)) : 0}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                        <Box className={"other-comments-sct"} display="flex" justifyContent="space-between" mt={3}>
                            <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                This is an estimate only, not a contract. This estimate is for completing the job
                                described above, based on our evaluation. It does not include unforeseen price
                                increases or additional labour and materials which may be required should problems arise
                            </Typography>
                        </Box>
                        <Box className={"other-comments-sct"} display="flex" justifyContent="space-between" mt={3}>
                            <Stack className={"other-comments-stack-left"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Box className={"other-comments-stack-title"} height={"20px"}
                                     sx={{backgroundColor: "#00f", color: "white"}} pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        PREPARED By:
                                    </Typography>
                                </Box>
                                <Stack className={"other-comments-stack-1"} ml={3} mt={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        SIGNATURE ..............................................
                                    </Typography>
                                </Stack>

                            </Stack>
                            <Stack className={"other-comments-stack-right"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Box className={"other-comments-stack-title"} height={"20px"}
                                     sx={{backgroundColor: "#00f", color: "white"}} pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        DATE:
                                    </Typography>
                                </Box>
                                <Stack className={"other-comments-stack-1"} ml={3} mt={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        ..............................................
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        <Box className={"other-comments-sct"} display="flex" justifyContent="space-between" mt={3}>
                            <Stack className={"other-comments-stack-left"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Box className={"other-comments-stack-title"} height={"20px"}
                                     sx={{backgroundColor: "#00f", color: "white"}} pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        INSPECTED By:
                                    </Typography>
                                </Box>
                                <Stack className={"other-comments-stack-1"} ml={3} mt={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        SIGNATURE ..............................................
                                    </Typography>
                                </Stack>

                            </Stack>
                            <Stack className={"other-comments-stack-right"} direction="column" width="40%"
                                   maxWidth="400px">
                                <Box className={"other-comments-stack-title"} height={"20px"}
                                     sx={{backgroundColor: "#00f", color: "white"}} pl={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        DATE:
                                    </Typography>
                                </Box>
                                <Stack className={"other-comments-stack-1"} ml={3} mt={3}>
                                    <Typography className={"subtitle2"} variant="subtitle2" gutterBottom>
                                        ..............................................
                                    </Typography>
                                </Stack>
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
