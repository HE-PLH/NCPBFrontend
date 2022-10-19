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
import Methods, {printElement} from "../utils/utilities";
import DatePickerComponent from "./datePicker";

// ----------------------------------------------------------------------


export default function SingleUserView() {
    const params = useParams();
    const navigate = useNavigate();
    const {showAppDialog, showEditDialog, handleShowAppDialog, handleEditDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [listUpdate, setListUpdate] = useState(false);
    const [site, setSite] = useState("");
    const [supplyProject, setUserProject] = useState("");
    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);

    const [dates, setDates] = useState({});

    const setParentState = (_dates) => {
        console.log(_dates[0]);
        setDates(_dates[0])
    }
    useEffect(() => {
        onDatesChange();
    }, [listUpdate]);

    useEffect(() => {
        onDatesChange();
    }, [dates])

    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'EntryPrice', label: 'EntryPrice', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Quantity', label: 'Quantity', alignRight: false},
        {id: 'Units', label: 'Units', alignRight: false},
        {id: 'SiteId', label: 'SiteId', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);


    const handleAddUser = () => {
        console.log("click");
        handleShowAppDialog();
    };

    function onDatesChange() {
        dates.startDate ?
            axios.post("http://127.0.0.1:9000/api/individualPeriodLogs", {
                Start_date: (dates.startDate).toLocaleDateString(),
                End_date: (dates.endDate).toLocaleDateString(),
                Id: params.Id,
            }).then((response) => {
                console.log(response.data.info)
                let timeTableHead = [{id: 'P/No', label: 'P/No', alignRight: false},
                    {id: 'Name', label: 'Name', alignRight: false}];
                let th = [];
                for (let i in response.data.info.table_head) {
                    let temp = {};
                    temp['id'] = i;
                    temp['label'] = i;
                    temp['alignRight'] = false;
                    th.push(temp);
                }
                for (let i in response.data.info.table_head) {
                    let temp = {};

                    temp['id'] = "Time In";
                    temp['label'] = "Time In";
                    temp['alignRight'] = false;
                    timeTableHead.push(temp);
                    temp = {};
                    temp['id'] = "Time Out";
                    temp['label'] = "Time Out";
                    temp['alignRight'] = false;
                    timeTableHead.push(temp);
                }

                let temp = {};
                temp['id'] = "Hrs/Wk";
                temp['label'] = "Hrs/Wk";
                temp['alignRight'] = false;
                timeTableHead.push(temp);

                temp = {};
                temp['id'] = "Variance";
                temp['label'] = "Variance";
                temp['alignRight'] = false;
                timeTableHead.push(temp);

                setTableHead(th);
                // setTimeTableHead(timeTableHead);

                for (let i = 0; i < response.data.info.groups.length; i++) {
                    let temp_items = [];
                    for (let thKey in response.data.info.table_head) {
                        let flag = false;
                        for (let j = 0; j < response.data.info.groups[i].items.length; j++) {
                            if (thKey === response.data.info.groups[i].items[j].Date) {
                                flag = true;
                                temp_items.push(response.data.info.groups[i].items[j])
                                break;
                            }
                        }

                        if (!flag) {
                            temp_items.push({
                                startTime: "",
                                Date: thKey,
                                endTime: ""
                            })
                        }
                    }
                    response.data.info.groups[i].items = temp_items;
                }

                setList(response.data.info.groups[0]||{});
            }) : null
    }


    const setUser = () => {

    };

    useEffect(() => {
        setListUpdate(!listUpdate);
    }, []);


    useEffect(() => {


    }, [])

    axios.post("http://127.0.0.1:9000/api/individualPeriodLogs", {
                Start_date: (dates.startDate).toLocaleDateString(),
                End_date: (dates.endDate).toLocaleDateString(),
                Id: params.Id,
            }).then(()=>{
                console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })

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
        axios.post("http://127.0.0.1:9000/api/individualPeriodLogs", [form_data]).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };


    const deleteItem = (_id) => {
        if (Array.isArray(_id)) {
            _id.map((item) => {
                axios.post("http://127.0.0.1:9000/api/individualPeriodLogs/delete", [{"_id": item}]).then((response) => {
                    console.log(response.data.info)
                    setListUpdate(!listUpdate);
                })
            })

        } else {
            axios.post("http://127.0.0.1:9000/api/individualPeriodLogs/delete", [{_id}]).then((response) => {
                console.log(response.data.info)
                setListUpdate(!listUpdate);
            })
        }
    };

    function isEmpty(obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

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
        axios.post("http://127.0.0.1:9000/api/individualPeriodLogs/update", form_data).then((response) => {
            console.log(response.data.info);
            setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const editItem = (_id) => {
        handleShowAppDialog(true);
        handleEditDialog(true);
        setEditId(_id);
        /*axios.get(`http://127.0.0.1:9000/api/individualPeriodLogs?_id=${_id}`).then((response) => {
            console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })*/

        axios.post("http://127.0.0.1:9000/api/individualPeriodLogs", {
                Start_date: (dates.startDate).toLocaleDateString(),
                End_date: (dates.endDate).toLocaleDateString(),
                Id: params.Id,
            }).then(()=>{
                console.log(response.data.info);
            setDefaultObject(response.data.info[0]);
        })
    };

    function _print(e) {
        console.log("printing...");
        printElement(document.querySelector(".MuiTableContainer-root"))
    }

    return (
        <Page title="Individual Report | NCPB">
            {showAppDialog && !showEditDialog ? (
                <AlertDialog
                    title={`Add User`}
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
                    title={`Edit User`}
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
                        User Report
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
                            Edit User Item
                        </Button>
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" maxWidth="50%" mb={1} ml={3}>
                    <Box>
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
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            sx={{"marginRight": "10px"}}
                            to="#"
                            startIcon={<Iconify icon="uil:print"/>}
                            onClick={_print}
                        >
                            Print Report
                        </Button>
                    </Box>

                </Stack>
                <Box sx={{position: "relative"}} className={"no-appearance"} mb={1}>
                    <DatePickerComponent setParentState={setParentState}/>
                </Box>
                <Card direction="column">
                    {list!==undefined?console.log(list.items):null}}

                </Card>
                {/*if (item.label === "Image") {
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
                                    <Avatar alt={item.label} src={supplyProject["ThumbUrl"] || ""}/>
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
                                        {supplyProject[item.label]}
                                    </Typography>
                                </Box>
                            )
                        }*/}
            </Box>
        </Page>
    );
}
