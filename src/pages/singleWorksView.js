import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate, useParams} from 'react-router-dom';
import RegisterUserForm from "../components/registerUser";
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
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../sections/@dashboard/user';

import MyTable from "../pages/Supplies/tb";
import AlertDialog from "../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../components/contexts/contexts";
import axios from 'axios'
import RegisterItemForm from "../components/registerItem";
import Box from "@mui/material/Box";
import {printElement} from "../utils/utilities";

// ----------------------------------------------------------------------


export default function SingleWorksView() {
    const params = useParams();
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [site, setSite] = useState("");
    const [projectWork, setProjectWork] = useState("");
    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'SiteId', label: 'SiteId', alignRight: false},
        {id: 'ProjectId', label: 'ProjectId', alignRight: false},
        {id: 'EstimatedTime', label: 'EstimatedTime', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false}
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
        axios.get(`http://127.0.0.1:9000/api/projectworks?_id=${params.Id}`).then((response) => {
            setProjectWork(response.data.info[0]);
            return response.data.info[0];
        }).then((res) => {
            axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${res.SiteId}`).then((response) => {
                setSite(response.data.info[0]);
            })
        })

    }, [])

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/projectworks").then((response) => {
            setList(response.data.info);
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
        axios.post("http://127.0.0.1:9000/api/projectworks", [form_data]).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/projectworks/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/projectworks/delete", [{_id}]).then((response) => {
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
        axios.post("http://127.0.0.1:9000/api/projectworks/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        axios.get(`http://127.0.0.1:9000/api/projectworks?_id=${_id}`).then((response) => {
            console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })

    };

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".MuiTableContainer-root"))
    }

    return (
        <Page title="Project Work | NCPB">
            {showAppDialog && !showEditDialog ? (
                <AlertDialog
                    title={`Add Project Work`}
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
                    title={`Edit Project Work`}
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
                        Single Supplied Item
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
                            Print Receipt
                        </Button>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="#"
                            startIcon={<Iconify icon="eva:plus-fill"/>}
                            // onClick={editItem(params.Id)}
                        >
                            Edit Project Work Item
                        </Button>
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" maxWidth="50%" mb={1} ml={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        ITEM DETAILS
                    </Typography>


                </Stack>
                <Card direction="column">
                    {table_head.map((item, index) => {
                        if (item.label === "Image") {
                            return (
                                <Box key={index} display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="50%" mb={1} ml={3}
                                     sx={{
                                         '&:hover': {
                                             background: "#3f51b5",
                                             color: "#fff"
                                         },
                                     }}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="100px" ml={1}>
                                        <Typography variant="subtitle3" gutterBottom>
                                            {item.label}
                                        </Typography>
                                        <Typography variant="subtitle3" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <Avatar alt={item.label} src={projectWork["ThumbUrl"] || ""}/>
                                </Box>
                            )
                        } else {
                            return (
                                <Box key={index} display="flex" direction="row"
                                     alignItems="center" justifyContent="space-between" maxWidth="50%" mb={1} ml={3}
                                     sx={{
                                         '&:hover': {
                                             background: "#3f51b5",
                                             color: "#fff"
                                         },
                                     }}
                                >
                                    <Box display="flex" direction="row" alignItems="center"
                                         justifyContent="space-between"
                                         width="100px" ml={1}>
                                        <Typography variant="subtitle3" gutterBottom>
                                            {item.label}
                                        </Typography>
                                        <Typography variant="subtitle3" gutterBottom>
                                            :
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle3" gutterBottom mr={1}>
                                        {projectWork[item.label]}
                                    </Typography>
                                </Box>
                            )
                        }
                    })}

                </Card>
            </Box>
        </Page>
    );
}
