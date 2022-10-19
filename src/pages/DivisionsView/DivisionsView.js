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
    TablePagination, TableHead
} from '@mui/material';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../../sections/@dashboard/user';

import MyTable from "./tb";
import MyStocksTable from "../supplyFromStocksTable";

import AlertDialog from "../../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../../components/contexts/contexts";

const {v4} = require("uuid");
import axios from 'axios'
import RegisterItemForm from "../../components/registerItem";
import Box from "@mui/material/Box";
import {printElement} from "../../utils/utilities";
import ItemListConfirmationDialog from "../../components/ItemListConfirmationDialog/AppDialog";

// ----------------------------------------------------------------------


export default function LogsView(props) {
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, handleShowAppDialog, showCardDialog, handleCardDialog, handleEditDialog, advancedSelectValue, setAdvancedSelectValue, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const params = useParams()
    const [confirmationItems, setConfirmationItems] = useState([]);
    const [editId, setEditId] = useState("");
    const [site, setSite] = useState("");
    const [supply, setSupply] = useState("");
    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'LogsType', label: 'LogsType', alignRight: false},
        {id: 'DivisionId', label: 'DivisionId', alignRight: false},
        {id: 'File', label: 'File', alignRight: false},
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
        axios.get(`http://127.0.0.1:9000/api/divisions?_id=${params.Id}`).then((response) => {
            setSupply(response.data.info[0]);
            setTableHead([
                {id: 'Name', label: 'Name', alignRight: false},
        {id: 'LogsType', label: 'LogsType', defaultValue: {Id: response.data.info[0].LogsType}, alignRight: false},
        {id: 'DivisionId', label: 'DivisionId', defaultValue: {Id: response.data.info[0].Id}, alignRight: false},
        {id: 'File', label: 'File', alignRight: false}
        ]
            );
            return (response.data.info[0]);
        }).then((res) => {
            axios.get(`http://127.0.0.1:9000/api/Logs?Id=${res.LogsType}`).then((response) => {
                setSite(response.data.info[0]);
            });
            axios.get("http://127.0.0.1:9000/api/files?DivisionId=" + res.Id).then((response) => {
                setList(response.data.info);
            })
        })
    }, []);

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/files?DivisionId=" + supply.Id).then((response) => {
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
        axios.post("http://127.0.0.1:9000/api/files", [form_data]).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/files/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/files/delete", [{_id}]).then((response) => {
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
        axios.post("http://127.0.0.1:9000/api/files/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
            setDefaultObject([]);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        axios.get(`http://127.0.0.1:9000/api/files?_id=${_id}`).then((response) => {
        setEditId(_id);
            console.log(response.data.info);
            let temp = response.data.info[0];
            // temp["LPO Number"] = temp["Id"]
            setDefaultObject(temp);
            handleShowAppDialog(true);
        handleEditDialog(true);
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
        console.log("here")
        navigate(`/ProjectView/SuppliesInvoice/${_id}`)

    };

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
            row["SupplyId"] = supply.Id;
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
        axios.post("http://127.0.0.1:9000/api/files", form_data).then((response) => {
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
        <Page title={`${site.Name || "Files"} | NCPB`}>
            <Box ml={1} mr={1}>
                <Box sx={{pt: 10}}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={site.Id} src={site.ThumbUrl || ""}/>
                        <Typography variant="h4" gutterBottom>
                            {site.Name} --- {site.Id}
                        </Typography>
                    </Stack>

                </Box>
                {showAppDialog && !showEditDialog ? (
                    showCardDialog ?
                        <ItemListConfirmationDialog
                            onlyCancel={true}
                            title={`Confirm File Items`}
                            confirm={confirmItems}
                            component={
                                <MyStocksTable confirmItems={confirmItems} list={confirmationItems}
                                               tableHead={stocks_table_head}/>
                            }
                        /> :
                        <AlertDialog
                            title={`Add File`}
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
                        title={`Edit Files`}
                        handleTextInput={handleEditTextInput}
                        component={
                            <RegisterItemForm
                                // supplyItemName={true}
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

                <Typography variant="h6" gutterBottom>
                    Files --- {supply.Name}, {supply.Id}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        Files
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
                            New File Item
                        </Button>
                    </Box>
                </Stack>

                <MyTable list={list} tableHead={table_head} deleteFunction={deleteItem}
                         editFunction={editItem} viewFunction={(e) => {
                    viewItem(e)
                }}/>
            </Box>
        </Page>
    );
}



