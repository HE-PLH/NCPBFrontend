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
    TableHead,
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
import ProjectJobCard from "../ProjectJobCard";
import ItemListConfirmationDialog from "../../components/ItemListConfirmationDialog/AppDialog";

// ----------------------------------------------------------------------


export default function SuppliesDelivery() {
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, handleShowAppDialog, showCardDialog, handleCardDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    let params = useParams();
    const [site, setSite] = useState("");
    const [supply, setSupply] = useState("");
    const [confimationItems, setConfirmationItems] = useState([]);
    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'EntryPrice', label: 'EntryPrice', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'SupplyId', label: 'SupplyId', alignRight: false},
        {id: 'DeliveredQuantity', label: 'DeliveredQuantity', alignRight: false},
        {id: 'DeliveryStatus', label: 'DeliveryStatus', alignRight: false},
        {id: 'InvoiceStatus', label: 'InvoiceStatus', alignRight: false},
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
        axios.get(`http://127.0.0.1:9000/api/supplies?Id=${params.Id}`).then((response) => {
            setSupply(response.data.info[0]);
            return (response.data.info[0]);
        }).then((res) => {
            axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${res.SiteId}`).then((response) => {
                setSite(response.data.info[0]);
            });
            axios.get("http://127.0.0.1:9000/api/individualsupplies?SupplyId=" + res.Id).then((response) => {
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
        axios.post("http://127.0.0.1:9000/api/individualsupplies", [form_data]).then((response) => {
            alert(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const confirmItems = () => {
        let form_data = [];
        let tmp = document.querySelector(".editted-items").querySelectorAll("tr");
        tmp.forEach((tr_element) => {
            let row = {};
            let tds = tr_element.querySelectorAll("input");
            row["_id"] = tds[0].id;
            row["DeliveredQuantity"] = tds[1].value;
            if (tds[1].value > 0) {
                if (tds[1].value < tds[1].name) {
                    row["DeliveryStatus"] = "Partially Delivered";
                } else {
                    row["DeliveryStatus"] = "Fully Delivered";
                }
            } else {
                row["DeliveryStatus"] = "Not Delivered";
            }
            form_data.push(row);
        });
        axios.post("http://127.0.0.1:9000/api/individualsupplies/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);

        });

        console.log(form_data);

    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/individualsupplies/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/individualsupplies/delete", [{_id}]).then((response) => {
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
        axios.post("http://127.0.0.1:9000/api/individualsupplies/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        axios.get(`http://127.0.0.1:9000/api/individualsupplies?_id=${_id}`).then((response) => {
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
        navigate(`/invoiceTemplate/${site.Id}/${_id}`)
    };

    const generateDelivery = (_id) => {
        // setViewId(_id);
        navigate(`/SuppliesDeliveryGen/${site.Id}/${_id}`)
    };

    const f = function (array, item) {
        if (array.length > 0) {
            return array.find(i => i === item) === item;
        }
    };

    const confirmDelivery = (_id) => {
        handleShowAppDialog(true);
        handleCardDialog(true);

        let tmp = list.filter((item)=>{
            return f(_id, item._id);
        });
        setConfirmationItems(tmp);

    };

    const generateCreditNote = (_id) => {
        navigate(`/creditNoteGen/${site.Id}/${_id}`)
        // setViewId(_id);

    };

    return (
        <div>
            {showAppDialog && !showEditDialog ? (
                showCardDialog ?
                    <ItemListConfirmationDialog
                        title={`Confirm Items Delivery`}
                        confirm={confirmItems}
                        component={
                            <Table mt={"10px"} className={"editted-items"}>
                                <TableHead sx={{backgroundColor: "#846fff"}}>
                                    <TableCell align="left" component="th" scope="row"
                                               padding="none">Supply Name</TableCell>
                                    <TableCell align="left" component="th" scope="row"
                                               padding="none">Quantity</TableCell>
                                    <TableCell align="left" component="th" scope="row"
                                               padding="none">Supply LPO Number</TableCell>
                                    <TableCell align="left" component="th" scope="row"
                                               padding="none">Delivery Number</TableCell>
                                </TableHead>
                                <TableBody>
                                    {confimationItems ? confimationItems.map((row) => {
                                        return (
                                            <TableRow>
                                                <TableCell align="left" component="td"
                                                           scope="row"
                                                           padding="none">
                                                    <input
                                                        defaultValue={row.Name}
                                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                                        type="text"
                                                        disabled
                                                        className="form-control"
                                                        id={row._id}
                                                        placeholder={"Name"}
                                                    /></TableCell>
                                                <TableCell align="left" component="td"
                                                           scope="row"
                                                           padding="none">
                                                    <input
                                                        defaultValue={row.Quantity}
                                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                                        type="text"
                                                        className="form-control"
                                                        id=""
                                                        name={row.Quantity}
                                                        placeholder={"Quantity"}
                                                    /></TableCell>
                                                <TableCell align="left" component="td"
                                                           scope="row"
                                                           padding="none">
                                                    <input
                                                        defaultValue={row.SupplyId}
                                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                                        type="text"
                                                        disabled
                                                        className="form-control"
                                                        id=""
                                                        placeholder={"Id"}
                                                    />
                                                </TableCell>
                                                <TableCell align="left" component="td"
                                                           scope="row"
                                                           padding="none">
                                                    <input
                                                        defaultValue={row.DeliveryNumber}
                                                        // onChange={(e) => SetVaccineName(e.target.value)}
                                                        type="text"
                                                        disabled
                                                        className="form-control"
                                                        id=""
                                                        placeholder={"No delivery note"}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }) : null}
                                </TableBody>
                            </Table>
                        }
                    /> :
                    <AlertDialog
                        title={`Add Supply`}
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
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="h4" gutterBottom>
                        General Delivery
                    </Typography>
                    <Box sx={{pt: 3}}>
                        <Typography variant="h4" gutterBottom>
                            {supply.Name} --- {supply.Id}
                        </Typography>

                    </Box>
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
                }} generateDelivery={generateDelivery} confirmDelivery={confirmDelivery} generateCreditNote={generateCreditNote}/>
            </Box>
        </div>
    );
}
