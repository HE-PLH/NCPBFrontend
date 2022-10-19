import {filter} from 'lodash';
import {sentenceCase} from 'change-case';
import React, {useContext, useEffect, useState} from 'react';
import {Link as RouterLink, useParams} from 'react-router-dom';
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
import {printElement} from "../../utils/utilities";
import ItemListConfirmationDialog from "../../components/ItemListConfirmationDialog/AppDialog";
import MyStocksTable from "../supplyFromStocksTable";
const {v4} = require("uuid");

// ----------------------------------------------------------------------


export default function ProjectSuppliesView() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, showCardDialog, handleCardDialog, handleEditDialog, advancedSelectValue, setAdvancedSelectValue, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const params=useParams();
    const [confirmationItems, setConfirmationItems] = useState([]);
    const [site, setSite] = useState({});
    const [project, setProject] = useState({});
    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'EntryPrice', label: 'EntryPrice', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'ProjectId', label: 'ProjectId', alignRight: false},
        {id: 'SiteId', label: 'SiteId', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);

    const [stocks_table_head, setStocksTableHead] = useState([
        {id: 'Description', label: 'Description', alignRight: false},
        {id: 'Amount', label: 'Amount', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
    ]);
    const [listUpdate, setListUpdate] = useState(false);

    const handleAddUser = () => {
        console.log("click");
        handleShowAppDialog();
    };


    const setUser = () => {

    };

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/projects?_id=${params.Id}`).then((response) => {
            setProject(response.data.info[0]);
            setTableHead([
                {id: 'Name', label: 'Name', alignRight: false},
                {id: 'Quantity', label: 'Quantity', alignRight: false},
                {id: 'Units', label: 'Units', alignRight: false},
                {id: 'EntryPrice', label: 'EntryPrice', alignRight: false},
                {id: 'Price', label: 'Price', alignRight: false},
                {id: 'ProjectId', label: 'ProjectId', defaultValue: response.data.info[0], alignRight: false},
                {id: 'SiteId', label: 'SiteId', defaultValue: {Id: response.data.info[0].SiteId}, alignRight: false},
                {id: 'Status', label: 'Status', alignRight: false},
                {id: 'Image', label: 'Image', alignRight: false},
            ]);
            return response.data.info[0];
        }).then((res) => {
            axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${res.SiteId}`).then((response) => {
                setSite(response.data.info[0]);
            })
        })
        setListUpdate(!listUpdate);
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/projectsupplies?projectId="+project.Id).then((response) => {
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
                let v = value.value;
                if (!v && field === "Name") {
                    value = advancedSelectValue.value;
                    if (value) {
                        form_data[field] = value;
                    } else {
                        form_data[field] = v;
                    }
                } else {
                    form_data[field] = v;
                }
            }
        });
        form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        form_data["Id"] = v4();
        axios.post("http://127.0.0.1:9000/api/projectsupplies", [form_data]).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/projectsupplies/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/projectsupplies/delete", [{_id}]).then((response) => {
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
                let v = value.value;
                if (!v && field === "Name") {
                    value = advancedSelectValue.value;
                    if (value) {
                        form_data[field] = value;
                    } else {
                        form_data[field] = v;
                    }
                } else {
                    form_data[field] = v;
                }

            }
        });
        form_data["_id"] = editId;
        form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        axios.post("http://127.0.0.1:9000/api/projectsupplies/update", form_data).then((response) => {
            alert(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        axios.get(`http://127.0.0.1:9000/api/projectsupplies?_id=${_id}`).then((response) => {
            console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })

    };

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".MuiTableContainer-root"))
    }
    const f = function (array, item) {
        if (array.length > 0) {
            return array.find(i => i === item) === item;
        }
    };


    const supplyFromStock = (_id) => {
        handleShowAppDialog(true);
        handleCardDialog(true);

        axios.get(`http://127.0.0.1:9000/api/getAvailableStocks`).then((response) => {
            console.log(response.data.info)
            setConfirmationItems(response.data.info)
        })
    };
    const confirmItems = (_id) => {
        let form_data = [];
        let temp_form_data = [];
        let tmp = document.querySelector(".editted-items").querySelectorAll("tr");
        tmp.forEach((tr_element) => {
            let row = {};
            let tds = tr_element.querySelectorAll("input");
            row["Name"] = tds[1].value;
            row["EntryPrice"] = tds[2].value;
            row["Price"] = tds[3].value;
            row["Quantity"] = tds[4].value;
            row["Units"] = tds[5].value;
            row["SiteId"] = site.Id;
            row["ProjectId"] = project.Id;
            row["Id"] = v4();

            if (f(_id, parseInt(tds[1].id))) {
                temp_form_data.push({
                    Description: row["Name"],
                    Amount: row["EntryPrice"],
                    Quantity: -parseFloat(row["Quantity"]),
                    Units: row["Units"],
                    Date: new Date().toLocaleDateString(),
                    Id: row["Id"],
                })
                form_data.push(row);
            }
        });
        axios.post("http://127.0.0.1:9000/api/projectsupplies", form_data).then((response) => {
            alert(response.data.info);
            setListUpdate(!listUpdate);

        }).then(() => {
            axios.post("http://127.0.0.1:9000/api/stocks", temp_form_data).then((response) => {
                console.log(response.data.info);
            })
        });

        console.log(temp_form_data);
        /*console.log(
        confirmationItems.filter((item)=>{
            return (f(_id, item._id));
        }))*/
    };

    return (
        <Page title={`${site.Name || "Project Sites"} | NCPB`}>
            {showAppDialog && !showEditDialog ? (
                showCardDialog ?
                        <ItemListConfirmationDialog
                            onlyCancel={true}
                            title={`Confirm Project Supply Items`}
                            confirm={confirmItems}
                            component={
                                <MyStocksTable confirmItems={confirmItems} list={confirmationItems}
                                               tableHead={stocks_table_head}/>
                            }
                        /> :
                <AlertDialog
                    title={`Add Project Supply`}
                    handleTextInput={handleTextInput}
                    component={
                        <RegisterItemForm
                            supplyItemName={true}
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
                    title={`Edit Supply`}
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
                <Typography variant="h6" gutterBottom>
                    Supply Items --- {project.Name}, {project.Id}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        Project Supply
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
                            onClick={supplyFromStock}
                        >
                            Supply From Stock
                        </Button>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="#"
                            startIcon={<Iconify icon="eva:plus-fill"/>}
                            onClick={handleAddUser}
                        >
                            New Project Supply
                        </Button>
                    </Box>
                </Stack>

                <MyTable list={list} tableHead={table_head} deleteFunction={deleteItem}
                         editFunction={editItem}/>
            </Box>
        </Page>
    );
}
