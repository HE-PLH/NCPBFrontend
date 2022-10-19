// material
import {alpha, styled} from '@mui/material/styles';
import {Card, Typography} from '@mui/material';
// utils
import {fShortenNumber} from '../../../utils/formatNumber';
// component
import Iconify from '../../../components/Iconify';
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({theme}) => ({
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(2, 0),
    color: theme.palette.primary.darker,
    backgroundColor: theme.palette.primary.lighter
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
    color: theme.palette.primary.dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
        theme.palette.primary.dark,
        0.24
    )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function AppWeeklySales() {
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://127.0.0.1:9000/api/Logs").then((response) => {
            let temp = response.data ? response.data.info : [];
            setTotal(temp.length);
        });
    }, []);

    const click = (e) => {
        navigate("../Logs", {replace: true})
    };

    return (
        <Card onClick={click}>
        <RootStyle>

                <IconWrapperStyle>
                    <Iconify icon="fa-solid:project-diagram" width={24} height={24}/>
                </IconWrapperStyle>
                <Typography variant="h3">{fShortenNumber(total)}</Typography>
                <Typography variant="subtitle2" sx={{opacity: 0.72}}>
                    Logs
                </Typography>

        </RootStyle>
        </Card>
    );
}
