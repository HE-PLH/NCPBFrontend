import {filter} from 'lodash';
import {sentenceCase} from 'change-case';

import {DataViewRenderer} from "../../utils/data_view";
import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
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
    TablePagination
} from '@mui/material';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../../sections/@dashboard/user';
//
import USERLIST from '../../_mocks_/user';
import UserTable from "../Users/tb";
import AlertDialog from "../../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../../components/contexts/contexts";
import axios from 'axios'
import {instanceOf} from "prop-types";
import Box from "@mui/material/Box";
import {createDomElement, printElement} from "../../utils/utilities";

import html2canvas from 'html2canvas'

// ----------------------------------------------------------------------


export default function User() {

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
        {id: 'Email', label: 'Email', alignRight: false},
        {id: 'Password', label: 'Password', alignRight: false},
        {id: 'County', label: 'County', alignRight: false},
        {id: 'Next of kin Name', label: 'Next of kin Name', alignRight: false},
        {id: 'Next of kin Phone Number', label: 'Next of kin Phone Number', alignRight: false},
        {id: 'Next of kin Nature Of RelationShip', label: 'Next of kin Nature Of RelationShip', alignRight: false},
        {id: 'Role', label: 'Role', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);

    const [listUpdate, setListUpdate] = useState(false);

    const handleAddUser = () => {
        console.log("click");
        handleShowAppDialog();
    };


    const setUser = () => {

    };

    useEffect(() => {
        setListUpdate(!listUpdate);
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/all-users/").then((response) => {
            console.log(response.data.info)
            setList(response.data.info);
        })
    }, [listUpdate]);

    const handleTextInput = () => {
        let el = document.querySelector(".register-user-form");
        let form_data = {};
        el.querySelectorAll(".master").forEach((div) => {
            let field = div.querySelector("label").innerText.split("*")[0].trim();
            if (field === "Image") {
                form_data[field] = uploadedImage;
                form_data["ThumbUrl"] = uploadedThumbUrl;

            } else if (field === "Features") {
                let value = {};
                div.querySelectorAll(".singleAmenity").forEach((elem) => {
                    let val = elem.querySelector(".check").checked;
                    let _field = elem.querySelector(".txt").value;
                    value[_field] = val;
                });

                form_data[field] = value;
            } else {
                let value = div.querySelector("input");
                if (!value) {
                    value = div.querySelector("select");
                }
                form_data[field] = value.value;
            }
        });
        axios.post("http://127.0.0.1:9000/api/all-users", [form_data]).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    const deleteUser = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/all-users/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })
        } else {
            axios.post("http://127.0.0.1:9000/api/all-users/delete", [{_id}]).then((response) => {
                console.log(response.data.info);
                setListUpdate(!listUpdate);
            })
        }
    };

    const handleEditTextInput = () => {
        let el = document.querySelector(".register-user-form");
        let form_data = {};
        el.querySelectorAll(".master").forEach((div) => {
            let field = div.querySelector("label").innerText.split("*")[0].trim();
            if (field === "Image") {
                form_data[field] = uploadedImage;
                form_data["ThumbUrl"] = uploadedThumbUrl;

            } else if (field === "Features") {
                // console.log(div)
                let value = {};
                div.querySelectorAll(".singleAmenity").forEach((elem) => {
                    let val = elem.querySelector(".check").checked ? "Active" : "Inactive";
                    let _field = elem.querySelector(".txt").value;
                    value[_field] = val;
                });

                console.log(value)
                form_data[field] = value;
            } else {
                let value = div.querySelector("input");
                if (!value) {
                    value = div.querySelector("select");
                }
                form_data[field] = value.value;
            }
        });
        form_data["_id"] = editId;
        console.log(form_data)
        axios.post("http://127.0.0.1:9000/api/all-users/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editUser = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        axios.get(`http://127.0.0.1:9000/api/all-users?_id=${_id}`).then((response) => {
            console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })

    };

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".MuiTableContainer-root"))
    }


    return (
        <Page title="User | NCPB">
            {showAppDialog && !showEditDialog ? (
                <AlertDialog
                    title={`Add User`}
                    handleTextInput={handleTextInput}
                    component={
                        <RegisterUserForm
                            tableHead={table_head}
                            loading="{isLoadingObject.isDeleting}"
                            deleteFunction="{DeleteVaccine}"
                            name="Patrick"
                            value="Patricode"
                            message="Note that all records associated to this vaccine including batches,vaccination and vaccination requests will also be deleted"
                        />
                    }
                />
            ) : null}
            {showEditDialog && showAppDialog ? (
                <AlertDialog
                    title={`Edit User`}
                    handleTextInput={handleEditTextInput}
                    component={
                        <RegisterUserForm
                            tableHead={table_head}
                            loading="{isLoadingObject.isDeleting}"
                            deleteFunction="{DeleteVaccine}"
                            defaultObject={defaultObject}
                            name="Patrick"
                            value="Patricode"
                            message="Note that all records associated to this vaccine including batches,vaccination and vaccination requests will also be deleted"
                        />
                    }
                />
            ) : null}
            <Box ml={1} mr={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        Users
                    </Typography>
                    <Box>
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
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="#"
                            startIcon={<Iconify icon="eva:plus-fill"/>}
                            onClick={handleAddUser}
                        >
                            New User
                        </Button>
                    </Box>
                </Stack>

                <UserTable list={list} tableHead={table_head} deleteFunction={deleteUser} editFunction={editUser}/>
            </Box>
        </Page>
    );
}
