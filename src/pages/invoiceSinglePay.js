// material
import {Box, Grid, Container, Typography} from '@mui/material';
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
import RegisterUserForm from "../components/registerUser";
import axios from "axios";
import {getToken} from "../utils/common";
import {ShowAppDialogContext} from "../components/contexts/contexts";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import {useParams} from "react-router-dom";

// ----------------------------------------------------------------------

export default function InvoiceSinglePay() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const params = useParams();
    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);

    const [table_head, setTableHead] = useState([
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'Amount', label: 'Amount', alignRight: false},
        {id: 'InvoiceId', label: 'InvoiceId', alignRight: false},
        {id: 'Date', label: 'Date', alignRight: false},
        {id: 'Time', label: 'Time', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},

    ]);

    useEffect(() => {
        let token = params.Id;
        console.log(token)
        axios.get(`http://127.0.0.1:9000/api/invoice?_id=${token}`).then((response) => {
            setTableHead([
                {id: 'Id', label: 'Id', alignRight: false},
                {id: 'Amount', label: 'Amount', alignRight: false},
                {
                    id: 'InvoiceId',
                    label: 'InvoiceId',
                    defaultValue: {"Id": response.data.info[0].Id},
                    alignRight: false
                },
                {id: 'Date', label: 'Date', alignRight: false},
                {id: 'Time', label: 'Time', alignRight: false},
                {id: 'Image', label: 'Image', alignRight: false},

            ])
        }).then(() => {
            axios.get(`http://127.0.0.1:9000/api/invoicepayment?Id=${token}`).then((response) => {
                console.log(response.data.info);
                let temp = response.data.info[0];
                setDefaultObject(temp);
                setEditId(token);
            })
        })

    }, [])

    const handleEditTextInput = () => {
        let el = document.querySelector(".register-user-form");
        console.log(el)
        let form_data = {};
        el.querySelectorAll(".master").forEach((div) => {
            let field = div.querySelector("label").innerText.split("*")[0].trim();
            if (field === "Image") {
                form_data[field] = uploadedImage;
                form_data["ThumbUrl"] = uploadedThumbUrl;

            } else {
                let value = div.querySelector("input");
                if (!value) {
                    value = div.querySelector("select");
                }
                form_data[field] = value.value;
            }
        });
        form_data["_id"] = defaultObject["_id"];
        axios.post("http://127.0.0.1:9000/api/invoicepayment/update", form_data).then((response) => {
            console.log(response.data.info);
            // setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    return (
        <Page title="Single Invoice Pay | NCPB">
            <Box ml={1} mr={1} maxWidth="xl">
                <Box sx={{pb: 1, mt: 10}}>
                    <Typography variant="h4">Single Invoice Pay</Typography>
                </Box>

                <Box>
                    <RegisterUserForm
                        tableHead={table_head}
                        loading="{isLoadingObject.isDeleting}"
                        deleteFunction="{DeleteVaccine}"
                        defaultObject={defaultObject}
                        name="Patrick"
                        value="Patricode"
                        message="Note that all records associated to this vaccine including batches,vaccination and vaccination requests will also be deleted"
                    />
                </Box>

                <Box>
                    <DialogActions>

                        <Button onClick={handleEditTextInput}
                                autoFocus>
                            Confirm Pay
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
        </Page>
    );
}
