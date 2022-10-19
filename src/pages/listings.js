import {useFormik} from 'formik';
import {Link as RouterLink, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from 'react';
// material
import {Avatar, Box, Button, Card, Container, Grid, Link, Stack, styled, Typography} from '@mui/material';
// components
import Page from '../components/Page';

//
import PRODUCTS from '../_mocks_/products';
import axios from "axios";
import ShopProductCard from "../sections/@dashboard/products/ProductCard";
import Label from "../components/Label";
import ColorPreview from "../components/ColorPreview";
import {fCurrency} from "../utils/formatNumber";
import AlertDialog from "../components/AppDialog/AppDialog";
import {ShowAppDialogContext} from "../components/contexts/contexts";

import {getRole, getToken, getUser} from "../utils/common";
import RegisterUserForm from "../components/registerUser";


const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'Image',
    position: 'absolute',
    transition: 'transform .4s ease-in-out',
    '&:hover': {
        transform: "scale(1.5)"
    },
});

// ----------------------------------------------------------------------

export default function Listings(props) {

    const [project, setHouse] = useState([]);
    const [site, setSite] = useState({});
    const [amenities, setFeatures] = useState([]);
    const [defaultObject, setDefaultObject] = useState([]);

    const [editId, setEditId] = useState("");

    const {showAppDialog, setShowAppDialog, handleEditDialog, showEditDialog, handleShowAppDialog, uploadedImage, uploadedThumbUrl} = useContext(ShowAppDialogContext);

    let params = useParams();

    let h;
    const [table_head, setTableHead] = useState([]);
    useEffect(() => {
        axios.get("http://127.0.0.1:9000//api/projects?Id=" + params.Id).then((response) => {
            console.log(response.data.info)
            setHouse(response.data.info[0]);
            h = response.data.info[0];
            let temp = [];
            for (let i in response.data.info[0]) {
                if (response.data.info[0].hasOwnProperty(i)) {
                    temp.push(
                        <li key={i}>
                            <Typography
                                component="span"
                                variant="body1"
                                sx={{
                                    // color: 'text.disabled',
                                    // textDecoration: 'line-through'
                                }}
                            >{i}</Typography> :
                            <Label
                                variant="filled"
                                color={'info'}
                                sx={{
                                    zIndex: 9,
                                    top: 16,
                                    right: 16,
                                    textTransform: 'uppercase'
                                }}
                            >{response.data.info[0][i]}</Label>
                        </li>)
                }
            }


            setFeatures(temp);
            return (response.data.info[0]);
        }).then((response) => {
            axios.get("http://127.0.0.1:9000//api/projectsites?Id=" + response.SiteId).then((response) => {
                setSite(response.data.info[0]);
                setTableHead([
                    {id: 'Id', label: 'Id', alignRight: false},
                    {id: 'PhoneNumber', label: 'PhoneNumber', alignRight: false},
                    {id: 'Occupation', label: 'Occupation', alignRight: false},
                    {id: 'Postal Address', label: 'Postal Address', alignRight: false},
                    {id: 'County', label: 'County', alignRight: false},
                    {id: 'Next of kin Name', label: 'Next of kin Name', alignRight: false},
                    {id: 'Next of kin Phone Number', label: 'Next of kin Phone Number', alignRight: false},
                    {
                        id: 'Next of kin Nature Of RelationShip',
                        label: 'Next of kin Nature Of RelationShip',
                        alignRight: false
                    },
                    {id: 'HouseId', label: 'HouseId', defaultValue: h, alignRight: false},
                    {id: 'ApartmentId', label: 'ApartmentId', defaultValue: response.data.info[0], alignRight: false},
                    {id: 'Image', label: 'Image', alignRight: false},
                ]);
                console.log(response.data.info[0]);
            })
        })
    }, [props]);

    const handleTextInput = () => {
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
        axios.post("https://rent-app-master.herokuapp.com/api/all-users/update", form_data).then((response) => {
            console.log(response.data.info);
            // setListUpdate(!listUpdate);
        });
        console.log(form_data);

    };

    const _requestForm=()=>{
        handleShowAppDialog();
        // handleEditDialog(true);

        axios.get(`http://127.0.0.1:9000//api/all-users?Id=${getToken()}`).then((response) => {
            let temp = response.data.info[0];
            temp["HouseId"] = params.Id;
            temp["ApartmentId"] = site.Id;
            setEditId(getUser()["_id"]);
            console.log(temp);

            setDefaultObject(temp);
        })
    }

    return (
        <Page title="Dashboard: Display project | Rent Management">
            {showAppDialog && !showEditDialog ? (
                <AlertDialog
                    title={`Tenant Registration Form`}
                    handleTextInput={handleTextInput}
                    component={
                        <RegisterUserForm
                            tableHead={table_head}
                            defaultObject={defaultObject}
                        />
                    }
                />
            ) : null}
            <Box ml={1} mr={1}>
                <Typography variant="h4" sx={{mb: 5}}>
                    {project.Name}
                </Typography>
                <Grid container>
                    <Grid key={project.Id} item md={6} xs={12}>
                        <Card>
                            <Box sx={{pt: '100%', position: 'relative', overflow: 'hidden'}}>
                                {"Status" && (
                                    <Label
                                        variant="filled"
                                        color={("Status" === 'Inactive' && 'error') || 'info'}
                                        sx={{
                                            zIndex: 9,
                                            top: 16,
                                            right: 16,
                                            position: 'absolute',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {project.Status}
                                    </Label>
                                )}
                                <ProductImgStyle alt={project.Name} src={project.Image}/>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Stack spacing={1} sx={{p: 1}}>
                            <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                                <Typography variant="subtitle2" noWrap>
                                    {project.Name}
                                </Typography>
                            </Link>

                            <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                                <Typography variant="subtitle2" noWrap>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Avatar alt={project.Name} src={site?site.ThumbUrl: ""}/>
                                        <Typography variant="subtitle2" noWrap>

                                            {site?`${site.Name}, ${site.Location}`:null}
                                        </Typography>
                                    </Stack>

                                </Typography>
                            </Link>
                            <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                                <Typography variant="subtitle2" noWrap>
                                    {project.Description}
                                </Typography>
                            </Link>

                            <Stack direction="row">
                                <ColorPreview colors={[[
                                    "#00AB55",
                                    "#000000",
                                    "#FFFFFF",
                                    "#FFC0CB",
                                    "#FF4842",
                                    "#1890FF",
                                    "#94D82D",
                                    "#FFC107"
                                ]]}/>
                                <Typography variant="subtitle1">
                                    &nbsp;
                                    {fCurrency(project.Price)}
                                </Typography>
                            </Stack>
                            <Stack direction="column">
                                <Typography variant="subtitle1">
                                    <ul>
                                        {amenities.map(e => e)}
                                    </ul>
                                </Typography>
                            </Stack>
                            {/*<Stack direction="row">
                                <Button fullWidth size="large" color={'primary'} variant="outlined"
                                        onClick={_requestForm}>
                                    <Typography variant="subtitle1">
                                        Request Form
                                    </Typography>
                                </Button>
                            </Stack>*/}
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Page>
    );
}
