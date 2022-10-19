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
import Methods from "../../../utils/utilities";

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

export default function PettyExpenses(props) {
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let temp = props.Expenses ? props.Expenses : 0;
            setTotal(temp);
    }, [props]);

    const click = (e) => {
        navigate("#", {replace: true})
    };

    return (
        <Card onClick={click}>
        <RootStyle>

                <IconWrapperStyle>
                    <Iconify icon="bx:money-withdraw" width={24} height={24}/>
                </IconWrapperStyle>
                <Typography variant="h3">{Methods.numberWithCommas(total)}</Typography>
                <Typography variant="subtitle2" sx={{opacity: 0.72}}>
                    Weekly Report
                </Typography>

        </RootStyle>
        </Card>
    );
}
