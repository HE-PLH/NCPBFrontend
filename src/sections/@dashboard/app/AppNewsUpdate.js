import {faker} from '@faker-js/faker';
import PropTypes from 'prop-types';
import {formatDistance} from 'date-fns';
import {Link as RouterLink} from 'react-router-dom';
// material
import {Box, Stack, Link, Card, Button, Divider, Typography, CardHeader} from '@mui/material';
// utils
import {mockImgCover} from '../../../utils/mockImages';
//
import Scrollbar from '../../../components/Scrollbar';
import Iconify from '../../../components/Iconify';
import {useEffect, useState} from "react";
import axios from "axios";
import {getRole, getUser} from "../../../utils/common";

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

NewsItem.propTypes = {
    news: PropTypes.object.isRequired
};

function NewsItem({news}) {
    console.log(news)
    const {Image, MessageType, Message, Date, Time} = news;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box
                component="img"
                alt={MessageType}
                src={Image}
                sx={{width: 48, height: 48, borderRadius: 1.5}}
            />
            <Box sx={{minWidth: 240}}>
                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {MessageType}
                    </Typography>
                </Link>
                <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                    {Message}
                </Typography>
            </Box>
            <Typography variant="caption" sx={{pr: 3, flexShrink: 0, color: 'text.secondary'}}>
                {(Time)}
            </Typography>
        </Stack>
    );
}

export default function AppNewsUpdate() {
    const [list, setList] = useState([]);

    useEffect(() => {
        if (getRole() === "Tenant") {
            console.log(getUser().Id)
            axios.get("https://rent-app-master.herokuapp.com/api/messages?UserId=" + getUser().Id).then((response) => {
                console.log(response.data.info)
                setList(response.data.info);
            })
        } else if (getRole() === "Landlord") {
            axios.get("https://rent-app-master.herokuapp.com/api/messages?ApartmentId=" + getUser().ApartmentId).then((response) => {
                console.log(response.data.info)
                setList(response.data.info);
            })
        } else if (getRole() === "Super Admin") {
            axios.get("https://rent-app-master.herokuapp.com/api/messages/").then((response) => {
                console.log(response.data.info);
                setList(response.data.info);
            })
        }

    }, [])

    return (
        <Card>
            <CardHeader title="News Update"/>

            <Scrollbar>
                <Stack spacing={3} sx={{p: 3, pr: 0}}>
                    {list.map((news) => (
                        <NewsItem key={news.MessageType} news={news}/>
                    ))}
                </Stack>
            </Scrollbar>

            <Divider/>

            <Box sx={{p: 2, textAlign: 'right'}}>
                <Button
                    to="/dashboard/messages"
                    size="small"
                    color="inherit"
                    component={RouterLink}
                    endIcon={<Iconify icon="eva:arrow-ios-forward-fill"/>}
                >
                    View all
                </Button>
            </Box>
        </Card>
    );
}
