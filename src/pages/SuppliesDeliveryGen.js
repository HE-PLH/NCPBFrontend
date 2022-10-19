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
import MyTable from "./no-string-supply-tb";
import {printElement} from "../utils/utilities";
import {setIn} from "formik";

// ----------------------------------------------------------------------

export default function SuppliesDeliveryGen() {
    const {setDelivery} = useContext(ShowAppDialogContext);

    const [site, setSite] = useState({});
    const [list, setList] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [LPONumber, setLPONumber] = useState(0);
    const [InvoiceNumber, setInvoiceNumber] = useState(0);
    const [VAT, setVAT] = useState(0);
    const [VATPerc, setVATPerc] = useState(16);
    const [taxInclusive, setTaxInclusive] = useState(false);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const params = useParams();
    const navigate = useNavigate();

    const [table_head, setTableHead] = useState([
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Total', label: 'Total', alignRight: false},
    ]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${params.SiteId}`).then((response) => {
            setSite(response.data.info[0]);
            console.log(response.data.info[0])
        })

    }, []);


    useEffect(() => {
        let temp = [];
        let items = params.Id.split(",");
        let len = items.length;
        let counter = 0;
        items.map((Id) => {
            axios.get("http://127.0.0.1:9000/api/individualsupplies?_id="+Id).then((response) => {
                // console.log(response.data.info[0].DeliveredQuantity)
                if (parseFloat(response.data.info[0].DeliveredQuantity)!==0) {
                    temp.push(response.data.info[0]);
                }
                counter++;
                if (counter===len){
                    setList(temp);
                    setLPONumber(temp[0].SupplyId);
                    setInvoiceNumber(temp[0].InvoiceNumber);
                    let sb = sumOfItems(temp);
                    console.log(sb);
                    setSubtotal(sb);
                    setVAT(VATPerc/100*sb);
                    setTotal(sb)//( - VAT/100*sb-discount))
                }
            })
        });

    }, []);

    useEffect(()=>{
        console.log(taxInclusive);
        if (!taxInclusive) {
            setTotal(subtotal - discount + VAT);
        }else{
            setTotal(subtotal - discount);
        }
    }, [subtotal, VAT, taxInclusive]);

    useEffect(()=>{
        setVAT(VATPerc/100*subtotal);
    }, [VATPerc]);


    useEffect(()=>{
        setTotal(subtotal-discount+VAT);
    }, [discount]);


    const sumOfItems=(lst)=>{
        let sum = 0;
        if (lst.length>0) {
            for (let i = 0; i < lst.length; i++) {
                sum += parseFloat(lst[i].Quantity) * parseFloat(lst[i].Price)
            }
        }
        return sum;

    };

    const _print = ()=>{

        let lst = [ "_date", "_time", "_deliveryId", "_clientName", "_phoneNumber", "_location", "_targetDepartment", "_box", "_total", "_subTotal", "_VAT", "_VATPerc", "_discount", "_inclusive", "_LPONumber", "_invoiceId"];

        let form_data = {};
        for (let i = 0; i < lst.length; i++) {
            switch (lst[i]) {
                case "_date":
                    form_data["Date"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_time":
                    form_data["Time"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_deliveryId":
                    form_data["Id"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_invoiceId":
                    form_data["InvoiceNumber"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_LPONumber":
                    form_data["LPONumber"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_clientName":
                    form_data["ClientName"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_phoneNumber":
                    form_data["ClientPhoneNumber"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_targetDepartment":
                    form_data["ClientTargetDepartment"] = document.querySelector(`.${lst[i]}`).value;
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
                case "_VATPerc":
                    form_data["CashVATPerc"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_inclusive":
                    form_data["TaxInclusive"] = document.querySelector(`.${lst[i]}`).checked;
                    break;
                case "_discount":
                    form_data["CashDiscount"] = document.querySelector(`.${lst[i]}`).value;
                    break;
            }
            // console.log(document.querySelector(`.${lst[i]}`).value)
        }

        form_data["Status"] = "Printed";
        form_data["items"] = [];
        let tmp = document.querySelector(".editted-items").querySelectorAll("tr");
        tmp.forEach((tr_element)=>{
            let row = {};
            let tds = tr_element.querySelectorAll("input");
            row["Id"] = tds[0].value;
            row["Name"] = tds[1].value;
            row["Quantity"] = tds[2].value;
            row["Units"] = tds[3].value;
            row["Price"] = tds[4].value;
            row["Total"] = tds[5].value;
            form_data["items"].push(row);
        });

        setDelivery(form_data);
        console.log(form_data);
        /*axios.post("http://127.0.0.1:9000/api/delivery", [form_data]).then((response) => {
            setDelivery(response.data.info);
        });*/
        // navigate(`deliveryTemplate/${site.Id}/${params.Id}/FinalSupplyDelivery`);
    };

    return (
        <Page title={`${site.Name || "Project Sites"} | NCPB`}>
            <Box ml={1} mr={1} maxWidth="xl">
                <Box sx={{pt: 10}}>
                    {/*<Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={site.Id} src={site.ThumbUrl || ""}/>
                        <Typography variant="h4" gutterBottom>
                            {site.Name} --- {site.Id}
                        </Typography>
                    </Stack>*/}

                </Box>
                <Box>
                    <Box ml={1} mr={1}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" gutterBottom>

                            </Typography>
                            <Box>
                                <Button
                                    variant="outlined"
                                    sx={{"marginRight": "10px"}}
                                    startIcon={<Iconify icon="uil:print"/>}
                                    component={RouterLink}
                                    onClick={_print}
                                    to="FinalSupplyDelivery"
                                >
                                    Create Delivery Note
                                </Button>
                            </Box>
                        </Stack>
                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Delivery Details
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
                                            {"Delivery Id"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        // defaultValue={defaultObject ? defaultObject[item.id] : item.defaultValue ? item.defaultValue : ""}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        // disabled
                                        className="form-control _deliveryId"
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
                                            {"LPONumber"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        value={LPONumber}
                                        onChange={(e) => setLPONumber(e.target.value)}
                                        type="text"
                                        className="form-control _LPONumber"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter LPONumber"}
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
                                            {"Invoice Number"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        value={InvoiceNumber}
                                        onChange={(e) => setInvoiceNumber(e.target.value)}
                                        type="text"
                                        className="form-control _invoiceId"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Invoice Number"}
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
                                            {"Delivery Date"}
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
                                        placeholder={"Enter Delivery Date"}
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
                                            {"Delivery Time"}
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
                                        placeholder={"Enter Delivery Time"}
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
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Client Target Department"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={list.length?list[0].TargetDepartment:""}
                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                        type="text"
                                        className="form-control _targetDepartment"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Client Target Department"}
                                    />
                                </Box>
                            </Stack>
                        </Card>
                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Supply Details
                                </Typography>
                            </Box>
                            <MyTable list={list} tableHead={table_head}/>
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
                            <Stack>
                                <Box display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="80%" mb={1} ml={3}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="150px" ml={1}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {"Vat in %"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        value={VATPerc}
                                        onChange={(e) => setVATPerc(e.target.value)}
                                        type="text"
                                        className="form-control _VATPerc"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Vat in %"}
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
                                            {"Vat in Ksh"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        value={VAT}
                                        onChange={(e) => setVAT(e.target.value)}
                                        type="text"
                                        disabled
                                        className="form-control _VAT"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Vat in Ksh"}
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
                                            {"Discount in Ksh"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        defaultValue={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                        type="text"
                                        className="form-control _discount"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Discount in Ksh"}
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
                                            {"Total"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        value={total}
                                        // onChange={(e) => setTotal(e.target.value)}
                                        disabled
                                        type="text"
                                        className="form-control _total"
                                        id=""
                                        style={{marginLeft: "10px"}}
                                        placeholder={"Enter Total"}
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
                                            {"Total Tax Inclusive"}
                                        </Typography>
                                        <Typography variant="subtitle2" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <input
                                        checked={taxInclusive}
                                        onChange={(e) => setTaxInclusive(e.target.checked)}
                                        type="checkbox"
                                        className="_inclusive"
                                        id=""
                                        style={{marginLeft: "0", width: "40px", height: "40px"}}
                                        placeholder={"Enter Tax Inclusive"}
                                    />

                                </Box>
                            </Stack>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Page>
    );
}
