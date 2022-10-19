// material
import {Box, Card, Grid, Container, Typography, Avatar, Stack, Button} from '@mui/material';
// components
import Page from '../components/Page';
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

const {v4} = require("uuid");
import {useNavigate, useParams} from "react-router";
import {Link as RouterLink} from "react-router-dom";
import Iconify from "../components/Iconify";
import AlertDialog from "../components/AppDialog/AppDialog";
import RegisterItemForm from "../components/registerItem";
import MyTable from "./no-string-projects-tb";
import {printElement} from "../utils/utilities";
import JobCardItems from "../components/contexts/jobcard-items";

// ----------------------------------------------------------------------

export default function ItemConfirmationWidget(props) {
    const {setInvoice} = useContext(ShowAppDialogContext);

    const [site, setSite] = useState({});
    const [list, setList] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [VAT, setVAT] = useState(0);
    const [VATPerc, setVATPerc] = useState(16);
    const [taxInclusive, setTaxInclusive] = useState(false);
    const [total, setTotal] = useState(0);
    const [discount, setDiscount] = useState(0);

    const params = useParams();
    const navigate = useNavigate();

    const [table_head, setTableHead] = useState([
        {id: 'Id', label: 'Id', alignRight: false},
        {id: 'Description', label: 'Description', alignRight: false},
        {id: 'Price', label: 'Price', alignRight: false},
        {id: 'Total', label: 'Total', alignRight: false},
    ]);

    useEffect(() => {
        axios.get(`http://127.0.0.1:9000/api/projectsites?Id=${props.site.Id}`).then((response) => {
            setSite(response.data.info[0]);
            console.log(response.data.info[0])
        })

    }, []);


    useEffect(() => {
        /*let temp = [];
        let items = props.list;
        let len = items.length;
        let counter = 0;
        items.map(({projectId}) => {
            axios.get("http://127.0.0.1:9000/api/projectworks?projectId="+Id).then((response) => {
                temp.push(response.data.info[0]);
                counter++;
                if (counter===len){
                    setList(temp);
                }
            })
        });*/
        setList(props.list);

    }, []);

    return (
        <Box ml={1} mr={1} maxWidth="xl">
                <Box sx={{pt: 10}}>
                    {/*<Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={site.Id} src={site.ThumbUrl || ""}/>
                        <Typography variant="h4" gutterBottom>
                            {site.Name} --- {site.Id}
                        </Typography>
                    </Stack>*/}

                </Box>
                <Box>
                    <Box ml={1} mr={1}>
                        <Card>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    Project Details
                                </Typography>
                            </Box>

                            <JobCardItems dv={list}/>
                        </Card>
                    </Box>
                </Box>
            </Box>
    );
}
