import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom';
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

import MyTable from "./tb";
import AlertDialog from "../../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../../components/contexts/contexts";
import axios from 'axios'
import RegisterItemForm from "../../components/registerItem";
import Box from "@mui/material/Box";
import Methods, {printElement} from "../../utils/utilities";
import DatePickerComponent from "../datePicker";

// ----------------------------------------------------------------------


export default function ProjectsInvoice() {
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    let params = useParams();
    const [site, setSite] = useState("");
    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'SiteId', label: 'SiteId', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);

    const [listUpdate, setListUpdate] = useState(false);
    const [dates, setDates] = useState({})

    const setParentState = (_dates) => {
        console.log(_dates[0])
        setDates(_dates[0])
    }

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
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${params.Id}`).then((response) => {
            setSite(response.data.info[0]);
        }).then(() => {
            axios.get("http://127.0.0.1:9000/api/projects?SiteId=" + params.Id).then((response) => {
                setList(response.data.info);
            })
        })

    }, [listUpdate]);

    const handleTextInput = () => {
        let el = document.querySelector(".register-item-form");
        let form_data = {};
        el.querySelectorAll(".master").forEach((div) => {
            let field = div.querySelector("label").innerText.split("*")[0].trim();
            if (field === "Image") {
                form_data[field] = uploadedImage;
                form_data["ThumbUrl"] = uploadedThumbUrl;

            } else if (field === "Amenities") {
                let value = {};
                div.querySelectorAll(".singleAmenity").forEach((elem) => {
                    let val = elem.querySelector(".check").checked ? "Active" : "Inactive";
                    let _field = elem.querySelector(".txt").value;
                    value[_field] = val;
                });

                console.log(value);
                form_data[field] = value;
            } else {
                let value = div.querySelector("input");
                if (!value) {
                    value = div.querySelector("select");
                }
                form_data[field] = value.value;
            }
        });
        form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        axios.post("http://127.0.0.1:9000/api/projects", [form_data]).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/projects/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/projects/delete", [{_id}]).then((response) => {
                console.log(response.data.info)
                setListUpdate(!listUpdate);
            })
        }
    };

    const handleEditTextInput = () => {
        let el = document.querySelector(".register-item-form");
        let form_data = {};
        el.querySelectorAll(".master").forEach((div) => {
            let field = div.querySelector("label").innerText.split("*")[0].trim();
            if (field === "Image") {
                form_data[field] = uploadedImage;
                form_data["ThumbUrl"] = uploadedThumbUrl;

            } else if (field === "Amenities") {
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
        form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        axios.post("http://127.0.0.1:9000/api/projects/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        axios.get(`http://127.0.0.1:9000/api/projects?_id=${_id}`).then((response) => {
            console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })

    };

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".MuiTableContainer-root"))
    }

    const viewItem = (_id) => {
        // setViewId(_id);
        navigate(`/SingleSupplyView/${_id}`)

    };
    const generateInvoice = (_id) => {
        // setViewId(_id);
        navigate(`/projectInvoiceTemplate/${site.Id}/${_id}`)
    };

    return (
        <div>
            {showAppDialog && !showEditDialog ? (
                <AlertDialog
                    title={`Add Project`}
                    handleTextInput={handleTextInput}
                    component={
                        <RegisterItemForm
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
                    title={`Edit Project`}
                    handleTextInput={handleEditTextInput}
                    component={
                        <RegisterItemForm
                            tableHead={table_head}
                            loading="{isLoadingObject.isDeleting}"
                            deleteFunction="{}"
                            defaultObject={defaultObject}
                            name="Patrick"
                            value="Patricode"
                            message=""
                        />
                    }
                />
            ) : null}
            <Box ml={1} mr={1}>
                <Box sx={{pt: 10}}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={site.Id} src={site.ThumbUrl || ""}/>
                        <Typography variant="h4" gutterBottom>
                            {site.Name} --- {site.Id}
                        </Typography>
                    </Stack>

                </Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        General Project Invoice
                    </Typography>
                    <Box>
                        {/*<Button
                            variant="outlined"
                            component={RouterLink}
                            sx={{"marginRight": "10px"}}
                            to="#"
                            startIcon={<Iconify icon="uil:print"/>}
                            onClick={_print}
                        >
                            Print Table
                        </Button>*/}
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
                    </Box>
                </Stack>
                <Box sx={{position: "relative"}} mb={1}>
                    <DatePickerComponent setParentState={setParentState}/>
                </Box>

                <MyTable list={list} tableHead={table_head} deleteFunction={deleteItem}
                         editFunction={editItem} viewFunction={(e) => {
                    viewItem(e)
                }} generateInvoice={generateInvoice}/>
            </Box>
        </div>
    );
}
