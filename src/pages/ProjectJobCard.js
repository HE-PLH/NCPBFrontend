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
import {useNavigate, useParams} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../components/Iconify";
import AlertDialog from "../components/AppDialog/AppDialog";
import RegisterItemForm from "../components/registerItem";
import MyTable from "./no-string-projects-tb";
import {printElement} from "../utils/utilities";
import JobCardItems from "../components/contexts/jobcard-items";

// ----------------------------------------------------------------------

export default function ProjectJobCard(props) {
    const {setInvoice} = useContext(ShowAppDialogContext);

    const [site, setSite] = useState({});
    const [list, setList] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [VAT, setVAT] = useState(0);
    const [VATPerc, setVATPerc] = useState(16);
    const [taxInclusive, setTaxInclusive] = useState(false);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const params = useParams();
    const navigate = useNavigate();

    const [table_head, setTableHead] = useState([
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'Description', label: 'Description', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Total', label: 'Total', alignRight: false},
    ]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${props.site.Id}`).then((response) => {
            setSite(response.data.info[0]);
            console.log(response.data.info[0])
        })

    }, []);

    useEffect(()=>{
        console.log(taxInclusive);
        if (!taxInclusive) {
            setTotal(subtotal - discount + VAT);
        }else{
            setTotal(subtotal - discount);
        }
    }, [subtotal, VAT, taxInclusive]);


    useEffect(() => {
        /*let temp = [];
        let items = props.list;
        let len = items.length;
        let counter = 0;
        items.map(({projectId}) => {
            axios.get("http://127.0.0.1:9000/api/projectworks?projectId="+Id).then((response) => {
                temp.push(response.data.info[0]);
                counter++;
                if (counter===len){
                    setList(temp);
                }
            })
        });*/

        setList(props.list);
        if (props.list.length) {
            console.log(props.list);
            let sb = sumOfItems(props.list);
            console.log(sb);
            setSubtotal(sb);
            setVAT(VATPerc / 100 * sb);
            setTotal(sb)//( - VAT/100*sb-discount))
        }

    }, [props]);

    const sumOfItems=(lst)=>{
        let sum = 0;
        if (lst.length>0) {
            for (let i = 0; i < lst.length; i++) {
                sum += parseFloat(lst[i].Price)
            }
        }
        return sum;

    };

    const _print = ()=>{
        let lst = [ "_date", "_time", "_jobId", "_clientName", "_phoneNumber", "_location", "_box", "_total", "_subTotal", "_VAT", "_discount, _inclusive"];
        let form_data = {};
        for (let i = 0; i < lst.length; i++) {
            console.log(lst[i]);
            switch (lst[i]) {
                case "_date":
                    form_data["Date"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_time":
                    form_data["Time"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_jobId":
                    form_data["JobId"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_clientName":
                    form_data["ClientName"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_phoneNumber":
                    form_data["ClientPhoneNumber"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_location":
                    form_data["ClientLocation"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_box":
                    form_data["ClientBox"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_subTotal":
                    form_data["CashSubtotal"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_total":
                    form_data["CashTotal"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_VAT":
                    form_data["CashVAT"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_inclusive":
                    console.log(document.querySelector(`.${lst[i]}`).checked);
                    form_data["TaxInclusive"] = document.querySelector(`.${lst[i]}`).checked;
                    break;
                case "_discount":
                    form_data["CashDiscount"] = document.querySelector(`.${lst[i]}`).value;
                    break;

            }
            // console.log(document.querySelector(`.${lst[i]}`).value)
        }
        form_data["items"] = [];

         document.querySelectorAll(".singleAmenity").forEach((elem)=>{
             let row = {};
                    let val = v4();
                    let _field = elem.querySelector(".txt").value;
                    row["Id"] = val;
                    row["Name"] = _field;
                    form_data["items"].push(row);
                });
        /*form_data["Status"] = "Printed";
        form_data["items"] = [];
        let tmp = document.querySelector(".editted-items").querySelectorAll("tr");
        tmp.forEach((tr_element)=>{
            let row = {};
            let tds = tr_element.querySelectorAll("input");
            row["Id"] = v4();
            row["Name"] = tds[1].value;
            form_data["items"].push(row);
        });*/

        setInvoice(form_data);
        console.log(form_data);
        /*axios.post("http://127.0.0.1:9000/api/invoice", [form_data]).then((response) => {
            setInvoice(response.data.info);
        });*/
        // navigate(`invoiceTemplate/${site.Id}/${params.Id}/FinalSupplyInvoice`);
    };

    return (
        <Box ml={1} mr={1} maxWidth="xl">

                <Box>
                    <Box ml={1} mr={1}>

                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Job Card Details
                                </Typography>
                            </Box>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Job Card Id"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        // defaultValue={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        disabled
                                        className="form-control _jobId"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"System Generated"}
                                    />
                                </Box>
                            </Stack>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Job Card Date"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={new Date().toLocaleDateString('en-CA')}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="date"
                                        className="form-control _date"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Job Card Date"}
                                    />
                                </Box>
                            </Stack>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Job Card Time"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={new Date().toLocaleTimeString()}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="time"
                                        className="form-control _time"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Job Card Time"}
                                    />
                                </Box>
                            </Stack>
                        </Card>
                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Client Details
                                </Typography>
                            </Box>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Client Name"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={site.Name}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        className="form-control _clientName"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Client Name"}
                                    />
                                </Box>
                            </Stack>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Client Phone Number"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={site.PhoneNumber}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        className="form-control _phoneNumber"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Client Phone Number"}
                                    />
                                </Box>
                            </Stack>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Client P.O Box"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={site.Address}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        className="form-control _box"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Client P.O Box"}
                                    />
                                </Box>
                            </Stack>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Client Location"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={site.Location}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        className="form-control _location"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Client Location"}
                                    />
                                </Box>
                            </Stack>

                        </Card>
                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Project Details
                                </Typography>
                            </Box>

                            <Card className={"master"}>
                            <JobCardItems dv={list}/>
                            </Card>
                        </Card>
                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Cash Details
                                </Typography>
                            </Box>
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Subtotal"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        value={subtotal}
                                        onChange={(e) => setSubtotal(e.target.value)}
                                        type="text"
                                        className="form-control _subTotal"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Subtotal"}
                                    />

                                </Box>
                            </Stack>
                        </Card>
                    </Box>
                </Box>
            </Box>
    );
}
