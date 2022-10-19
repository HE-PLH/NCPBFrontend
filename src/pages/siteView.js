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
import MyTable from "./Projects/tb";
import {printElement} from "../utils/utilities";
import SuppliesView from "./Supplies-View/Supplies";

// ----------------------------------------------------------------------

export default function SiteView() {
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
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'Location', label: 'Location', alignRight: false},
        {id: 'Address', label: 'Address', alignRight: false},
        {id: 'PhoneNumber', label: 'PhoneNumber', alignRight: false},
        {id: 'ContactPerson', label: 'ContactPerson', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);
    const [project_table_head, setProjectTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'LPO Number', label: 'LPO Number', alignRight: false},
        {id: 'SiteId', label: 'SiteId', alignRight: false},
        {id: 'EstimatedTime', label: 'EstimatedTime', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Status', label: 'Status', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false}
    ]);
    const handleAddUser = () => {
        console.log("click");
        handleShowAppDialog();
    };

    const handleFirstClick = (e, ch) => {
        setFlag2(true);
        setFlag1(false);
        setChoice(ch)
    };

    const handleSecondClick = (e, ch) => {
        setFlag1(true);
        setFlag2(false);
        setChoice(ch)
    };

    useEffect(() => {


        setFlag1(false);
        setChoice("Works");
        axios.get(`http://127.0.0.1:9000/api/projectsites?_id=${params.Id}`).then((response) => {
            setSite(response.data.info[0]);
            setProjectTableHead([
                {id: 'Name', label: 'Name', alignRight: false},
                {id: 'LPO Number', label: 'LPO Number', alignRight: false},
                {id: 'SiteId', label: 'SiteId', defaultValue: response.data.info[0], alignRight: false},
                {id: 'EstimatedTime', label: 'EstimatedTime', alignRight: false},
                {id: 'Price', label: 'Price', alignRight: false},
                {id: 'Status', label: 'Status', alignRight: false},
                {id: 'Image', label: 'Image', alignRight: false},
            ])
        })
    }, [])

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/projectsites?_id=${params.Id}`).then((response) => {
            setSite(response.data.info[0]);
            return (response.data.info[0]);
        }).then((res) => {
            axios.get(`http://127.0.0.1:9000/api/projects?SiteId=${res.Id}`).then((response) => {
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
        form_data["Id"] = form_data["Id"] || form_data["LPO Number"];
        form_data["Date"] = new Date().toLocaleDateString();
        form_data["Time"] = new Date().toLocaleTimeString();
        axios.post("http://127.0.0.1:9000/api/projects", [form_data]).then((response) => {
            alert(response.data.info);
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
        form_data["Id"] = form_data["Id"] || form_data["LPO Number"];
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
            let temp = response.data.info[0];
            temp["LPO Number"] = temp["Id"]
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
        <Page title={`${site.Name || "Project Sites"} | NCPB`}>
            <Box ml={1} mr={1} maxWidth="xl">
                <Box sx={{pt: 10}}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={site.Id} src={site.ThumbUrl || ""}/>
                        <Typography variant="h4" gutterBottom>
                            {site.Name} --- {site.Id}
                        </Typography>
                    </Stack>

                </Box>
                <Box sx={{justifyContent: "center", display: "flex"}}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        color={flag1 ? 'primary' : 'secondary'}
                        sx={{"marginRight": "10px"}}
                        to="#"
                        startIcon={<Iconify icon="uil:print"/>}
                        onClick={(e) => handleFirstClick(e, "Works")}
                    >
                        Works
                    </Button>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        sx={{"marginRight": "10px"}}
                        color={flag2 ? 'primary' : 'secondary'}
                        to="#"
                        startIcon={<Iconify icon="eva:plus-fill"/>}
                        onClick={(e) => handleSecondClick(e, "Supply")}
                    >
                        Supply
                    </Button>
                </Box>
                {
                    choice === "Works" ?
                        <Box>
                            {showAppDialog && !showEditDialog ? (
                                <AlertDialog
                                    title={`Add Project`}
                                    handleTextInput={handleTextInput}
                                    component={
                                        <RegisterItemForm
                                            tableHead={project_table_head}
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
                                            tableHead={project_table_head}
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
                                        Site Projects
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
                                            sx={{"marginRight": "10px"}}
                                            to={`/ProjectView/ProjectInvoice/${site.Id}`}
                                            startIcon={<Iconify icon="map:finance"/>}
                                            // onClick={(_id)=>{navigate(`/ProjectView/SuppliesInvoice/${_id}`)}}
                                        >
                                            Generate Invoice
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            component={RouterLink}
                                            to="#"
                                            startIcon={<Iconify icon="eva:plus-fill"/>}
                                            onClick={handleAddUser}
                                        >
                                            New Project
                                        </Button>
                                    </Box>
                                </Stack>

                                <MyTable list={list} tableHead={project_table_head} deleteFunction={deleteItem}
                                         editFunction={editItem} viewFunction={(e) => {
                                    viewItem(e)
                                }}/>
                            </Box>
                        </Box> :
                        choice === "Supply" ?
                            <Box>
                                <SuppliesView _SiteId={site.Id} SiteId={site._id}/>
                            </Box> : null
                }


            </Box>
        </Page>
    );
}
