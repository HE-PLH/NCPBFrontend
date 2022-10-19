// material
import {Avatar, Box, Button, Stack, Typography} from '@mui/material';
// components
import Page from '../components/Page';
import React, {useContext, useEffect, useState} from "react";
import {ShowAppDialogContext} from "../components/contexts/contexts";
import axios from "axios";
import {useNavigate, useParams} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../components/Iconify";
import AlertDialog from "../components/AppDialog/AppDialog";
import RegisterItemForm from "../components/registerItem";
import MyTable from "./Projects/tb";
import {printElement} from "../utils/utilities";
import ProjectJobCard from "./ProjectJobCard";

const {v4} = require("uuid");

// ----------------------------------------------------------------------

export default function ProjectView() {
    const {showAppDialog, showEditDialog, handleShowAppDialog, showCardDialog, handleCardDialog, handleEditDialog, uploadedImage, uploadedThumbUrl, setViewId, setJobCard} = useContext(ShowAppDialogContext);
    const [defaultObject, setDefaultObject] = useState([]);

    const [editId, setEditId] = useState("");
    const [list, setList] = useState([]);
    const [listUpdate, setListUpdate] = useState(false);
    let params = useParams();
    let navigate = useNavigate();
    const [site, setSite] = useState("");
    const [project, setProject] = useState("");
    const [choice, setChoice] = useState("");
    const [flag1, setFlag1] = useState(true);
    const [flag2, setFlag2] = useState(true);
    const [table_head, setTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'Location', label: 'Location', alignRight: false},
        {id: 'Address', label: 'Address', alignRight: false},
        {id: 'PhoneNumber', label: 'PhoneNumber', alignRight: false},
        {id: 'ContactPerson', label: 'ContactPerson', alignRight: false},
        {id: 'Image', label: 'Image', alignRight: false},
    ]);
    const [project_work_table_head, setProjectWorkTableHead] = useState([
        {id: 'Name', label: 'Name', alignRight: false},
        {id: 'SiteId', label: 'SiteId', alignRight: false},
        {id: 'ProjectId', label: 'ProjectId', alignRight: false},
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
        axios.get(`http://127.0.0.1:9000/api/projects?_id=${params.Id}`).then((response) => {
            setProject(response.data.info[0]);

            setProjectWorkTableHead([
                {id: 'Name', label: 'Name', alignRight: false},
                {id: 'SiteId', label: 'SiteId', defaultValue: {Id: response.data.info[0].SiteId}, alignRight: false},
                {id: 'ProjectId', label: 'ProjectId', defaultValue: response.data.info[0], alignRight: false},
                {id: 'EstimatedTime', label: 'EstimatedTime', alignRight: false},
                {id: 'Price', label: 'Price', alignRight: false},
                {id: 'Status', label: 'Status', alignRight: false},
                {id: 'Image', label: 'Image', alignRight: false}
            ]);
            return response.data.info[0];
        }).then((res) => {
            axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${res.SiteId}`).then((response) => {
                setSite(response.data.info[0]);
            })
        })

    }, [])

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/projectworks?ProjectId=" + project.Id).then((response) => {
            setList(response.data.info);
        })
    }, [listUpdate, project]);

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
        form_data["Id"] = v4();
        axios.post("http://127.0.0.1:9000/api/projectworks", [form_data]).then((response) => {
            alert(response.data.info);
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

    const viewItem = (_id) => {
        // setViewId(_id);
        navigate(`/SingleWorksView/` + _id)

    };

    const jobCard = () => {
        // setViewId(_id);
        handleShowAppDialog(true);
        handleCardDialog(true);
    };

    const generateJobCard = () => {
        let lst = ["_date", "_time", "_clientName", "_phoneNumber", "_location", "_box", "_subTotal"];

        let form_data = {};
        for (let i = 0; i < lst.length; i++) {
            console.log(lst[i]);
            switch (lst[i]) {
                case "_date":
                    form_data["Date"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_time":
                    form_data["Time"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_jobcardId":
                    form_data["Id"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_clientName":
                    form_data["ClientName"] = document.querySelector(`.${lst[i]}`).value;
                    break;

                case "_phoneNumber":
                    form_data["ClientPhoneNumber"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_location":
                    form_data["ClientLocation"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_box":
                    form_data["ClientBox"] = document.querySelector(`.${lst[i]}`).value;
                    break;
                case "_subTotal":
                    form_data["CashSubtotal"] = document.querySelector(`.${lst[i]}`).value;
                    break;
            }
            // console.log(document.querySelector(`.${lst[i]}`).value)
        }

        form_data["Status"] = "Printed";
        form_data["items"] = [];
        document.querySelectorAll(".singleAmenity").forEach((elem) => {
            let tmp = {};
            // let val = elem.querySelector(".check").checked ? "Active" : "Inactive";
            tmp["Name"] = elem.querySelector(".txt").value;
            tmp["Id"] = v4();
            form_data["items"].push(tmp)
        });

        setJobCard(form_data);
        console.log(form_data);
        /*axios.post("http://127.0.0.1:9000/api/invoice", [form_data]).then((response) => {
            setInvoice(response.data.info);
        });*/
        // navigate(`ProjectView/${site.Id}/${params.Id}/FinalJobCardInvoice`);
        navigate(`/${site.Id}/${params.Id}/FinalJobCardInvoice`);

    };

    const goToProjectSupplies=()=>{
        navigate(`../ProjectSuppliesView/${params.Id}`, {replace: true});
    }

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
                <Box>
                    {console.log(showCardDialog)}
                    {showAppDialog && !showEditDialog ? (
                        showCardDialog ?
                            <AlertDialog
                                title={`Create Job Card`}
                                handleTextInput={generateJobCard}
                                component={
                                    <ProjectJobCard site={site} list={list}/>
                                }
                            />
                            :
                            <AlertDialog
                                title={`Add Project Work`}
                                handleTextInput={handleTextInput}
                                component={
                                    <RegisterItemForm
                                        tableHead={project_work_table_head}
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
                                    tableHead={project_work_table_head}
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
                            <Typography variant="h6" gutterBottom>
                                Projects Works --- {project.Name}, {project.Id}
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
                                    // component={RouterLink}
                                    sx={{"marginRight": "10px"}}
                                    // to="#"
                                    startIcon={<Iconify icon="uil:print"/>}
                                    onClick={jobCard}
                                >
                                    Create Job Card
                                </Button>
                                <Button
                                    variant="outlined"
                                    // component={RouterLink}
                                    sx={{"marginRight": "10px"}}
                                    // to="#"
                                    startIcon={<Iconify icon="eva:plus-fill"/>}
                                    onClick={goToProjectSupplies}
                                >
                                    Project Supplies
                                </Button>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to="#"
                                    startIcon={<Iconify icon="eva:plus-fill"/>}
                                    onClick={handleAddUser}
                                >
                                    New Project Work
                                </Button>
                            </Box>
                        </Stack>

                        <MyTable list={list} tableHead={project_work_table_head} deleteFunction={deleteItem}
                                 editFunction={editItem} viewFunction={(e) => {
                            viewItem(e)
                        }}/>
                    </Box>
                </Box>


            </Box>
        </Page>
    );
}
