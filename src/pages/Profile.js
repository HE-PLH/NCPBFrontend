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

// ----------------------------------------------------------------------

export default function Profile() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);

    const [table_head, setTableHead] = useState([
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'FirstName', label: 'FirstName', alignRight: false},
        {id: 'LastName', label: 'LastName', alignRight: false},
        {id: 'PhoneNumber', label: 'PhoneNumber', alignRight: false},
        {id: 'Occupation', label: 'Occupation', alignRight: false},
        {id: 'Postal Address', label: 'Postal Address', alignRight: false},
        {id: 'County', label: 'County', alignRight: false},
        {id: 'Next of kin Name', label: 'Next of kin Name', alignRight: false},
        {id: 'Next of kin Phone Number', label: 'Next of kin Phone Number', alignRight: false},
        {id: 'Next of kin Nature Of RelationShip', label: 'Next of kin Nature Of RelationShip', alignRight: false},
        {id: 'Email', label: 'Email', alignRight: false},
        {id: 'Password', label: 'Password', alignRight: false},
        {id: 'Role', label: 'Role', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},

    ]);

    useEffect(() => {
        let token = getToken();
        console.log(token)
        axios.get(`http://127.0.0.1:9000/api/all-users?Id=${token}`).then((response) => {
            console.log(response.data.info);
            let temp = response.data.info[0];
            setDefaultObject(temp);
            setEditId(token);
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
        axios.post("http://127.0.0.1:9000/api/all-users/update", form_data).then((response) => {
            console.log(response.data.info);
            // setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    return (
        <Page title="Profile | NCPB">
            <Box ml={1} mr={1} maxWidth="xl">
                <Box sx={{pb: 5}}>
                    <Typography variant="h4">Profile Information</Typography>
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
                            Update Details
                        </Button>
                    </DialogActions>
                </Box>
            </Box>
        </Page>
    );
}
