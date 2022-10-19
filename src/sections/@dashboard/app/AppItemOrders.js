// material
import {alpha, styled} from '@mui/material/styles';
import {Card, Typography, Button} from '@mui/material';
// utils
import {fShortenNumber} from '../../../utils/formatNumber';
//
import Iconify from '../../../components/Iconify';
import {useEffect, useState} from "react";
import axios from "axios";


import {Link as RouterLink, useNavigate} from "react-router-dom";
// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({theme}) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(2, 0),
    color: theme.palette.warning.darker,
    backgroundColor: theme.palette.warning.lighter
}));

const IconWrapperStyle = styled('div')(({theme}) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(3),
    height: theme.spacing(3),
    justifyContent: 'center',
    // marginBottom: theme.spacing(3),
    color: theme.palette.warning.dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
        theme.palette.warning.dark,
        0.24
    )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1723315;

export default function AppItemOrders() {
    const [total, setTotal] = useState(0);
    const navigate=useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/game-types").then((response) => {
            let temp = response.data ? response.data.info : [];
            setTotal(temp.length);
        });
    }, []);

    const click = (e)=>{
      navigate("../GameType", {replace: true})
    };

    return (
        <Card onClick={click}>
        <RootStyle>
                <IconWrapperStyle>
                    <Iconify icon="bx:money-withdraw" width={24} height={24}/>
                </IconWrapperStyle>
                <Typography variant="h3">{fShortenNumber(total)}</Typography>
                <Typography variant="subtitle2" sx={{opacity: 0.72}}>
                    Logs
                </Typography>
        </RootStyle>
        </Card>

    );
}