// material
import {Box, Grid, Container, Typography, Avatar, Stack, Button} from '@mui/material';
// components
import Page from '../components/Page';

const {v4} = require("uuid");
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
import {useNavigate, useParams} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../components/Iconify";
import AlertDialog from "../components/AppDialog/AppDialog";
import RegisterItemForm from "../components/registerItem";
import MyTable from "./Stocks/tb";
import {printElement} from "../utils/utilities";
import SuppliesView from "./Supplies-View/Supplies";

// ----------------------------------------------------------------------

export default function Stocks() {
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl, setViewId} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);
    const [listUpdate, setListUpdate] = useState(false);
    let params = useParams();
    const [site, setSite] = useState("");
    const [choice, setChoice] = useState("");
    const [flag1, setFlag1] = useState(true);
    const [flag2, setFlag2] = useState(true);
    const [flag3, setFlag3] = useState(true);
    const [table_head, setTableHead] = useState([
        {id: 'Description', label: 'Description', alignRight: false},
        {id: 'Amount', label: 'Amount', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'Date', label: 'Date', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);
    const [stocks_head, setStocksHead] = useState([
        {id: 'Description', label: 'Description', alignRight: false},
        {id: 'Amount', label: 'Amount', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'Date', label: 'Date', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);
    const handleAddUser = () => {
        console.log("click");
        handleShowAppDialog();
    };

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/stocks`).then((response) => {
            setSite(response.data.info[0]);
        });
        setListUpdate(!listUpdate);
    }, [])

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/stocks`).then((response) => {
            setList(response.data.info);
            return (response.data.info[0]);
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
        form_data["Id"] = v4();
        // form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        axios.post("http://127.0.0.1:9000/api/stocks", [form_data]).then((response) => {
            alert(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);
    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/stocks/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/stocks/delete", [{_id}]).then((response) => {
                alert(response.data.info)
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
        form_data["Id"] = form_data["Id"];
        // form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        axios.post("http://127.0.0.1:9000/api/stocks/update", form_data).then((response) => {
            alert(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        axios.get(`http://127.0.0.1:9000/api/stocks?_id=${_id}`).then((response) => {
            console.log(response.data.info);
            let temp = response.data.info[0];
            temp["LPO Number"] = temp["Id"];
            setDefaultObject(temp);
        })

    };

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".MuiTableContainer-root"))
    }

    const viewItem = (_id) => {
        // setViewId(_id);
        navigate(`/ProjectView/${_id}`)

    };

    return (
        <Page title={`Stocks | NCPB`}>
            <Box ml={1} mr={1} maxWidth="xl">
                <Box sx={{justifyContent: "center", display: "flex"}}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        color={flag1 ? 'primary' : 'secondary'}
                        sx={{"marginRight": "10px"}}
                        to="#"
                        startIcon={<Iconify icon="bx:money-withdraw"/>}
                        onClick={(e) => handleFirstClick(e, "Expenses")}
                    >
                        Expenses
                    </Button>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        sx={{"marginRight": "10px"}}
                        color={flag2 ? 'primary' : 'secondary'}
                        to="#"
                        startIcon={<Iconify icon="eva:plus-fill"/>}
                        onClick={(e) => handleSecondClick(e, "Money In")}
                    >
                        Money In
                    </Button>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        sx={{"marginRight": "10px"}}
                        color={flag3 ? 'primary' : 'secondary'}
                        to="#"
                        startIcon={<Iconify icon="carbon:report"/>}
                        onClick={(e) => handleThirdClick(e, "Stocks Summary")}
                    >
                        Stocks Summary
                    </Button>
                </Box>

                <Box>
                    {showAppDialog && !showEditDialog ? (
                        <AlertDialog
                            title={`Add Project`}
                            handleTextInput={handleTextInput}
                            component={
                                <RegisterItemForm
                                    tableHead={stocks_head}
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
                            title={`Edit Site`}
                            handleTextInput={handleEditTextInput}
                            component={
                                <RegisterItemForm
                                    tableHead={stocks_head}
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
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                            <Typography variant="h4" gutterBottom>
                                Stocks
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
                                    New Expenses Item
                                </Button>
                            </Box>
                        </Stack>

                        <MyTable list={list} tableHead={stocks_head} deleteFunction={deleteItem}
                                 editFunction={editItem} viewFunction={(e) => {
                            viewItem(e)
                        }}/>
                    </Box>
                </Box>


            </Box>
        </Page>
    );
}
