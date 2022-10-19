import PropTypes from 'prop-types';
// material
import {styled} from '@mui/material/styles';
import {
    Toolbar,
    Tooltip,
    Stack,
    Box,
    IconButton,
    Typography,
    OutlinedInput,
    InputAdornment, Button
} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import React, {useEffect} from "react";
import {Link as RouterLink} from "react-router-dom";

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
    // height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    // padding: theme.spacing(0, 1, 0, 3),
    padding: theme.spacing(0)
}));

const SearchStyle = styled(OutlinedInput)(({theme}) => ({
    className: "no-appearance",
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {width: 320, boxShadow: theme.customShadows.z8},
    '& fieldset': {
        borderWidth: `1px !important`,
        // borderColor: `${theme.palette.grey[500_32]} !important`
    }
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    searchName: PropTypes.string,
    onFilterName: PropTypes.func,
    invoicable: PropTypes.bool
};

export default function UserListToolbar(props) {
    const {searchName, numSelected, filterName, onFilterName, invoicable, deliverable, confirmStocks} = props;

    const deleteSelected = () => {
        props.deleteSelected(props.selected)
    };
    const generateInvoice = () => {
        props.generateInvoice(props.selected)
    };
    const generateDelivery = () => {
        props.generateDelivery(props.selected)
    };
    const confirmDelivery = () => {
        props.confirmDelivery(props.selected)
    };
    const generateCreditNote = () => {
        props.generateCreditNote(props.selected)
    };
    const confirmStocksFunction = () => {
        props.confirmStocksFunction(props.selected)
    };

    useEffect(() => {
        console.log(props.searchName)
    }, []);

    return (
        <RootStyle
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter'
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <SearchStyle
                    value={filterName}
                    onChange={onFilterName}
                    placeholder={`Search ...`}
                    startAdornment={
                        <InputAdornment className={"no-appearance"} position="start">
                            <Iconify icon="eva:search-fill" sx={{color: 'text.disabled'}}/>
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 ? (
                confirmStocks ?
                    <Box><Tooltip title="Confirm Items">
                        <Button
                            variant="outlined"
                            color={"secondary"}
                            sx={{"marginRight": "10px"}}
                            startIcon={<Iconify icon="map:finance"/>}
                            onClick={confirmStocksFunction}
                        >
                            Confirm Items
                        </Button>
                    </Tooltip></Box> :invoicable ?
                    <Box><Tooltip title="Delete">
                        <IconButton onClick={deleteSelected}>
                            <Iconify icon="eva:trash-2-fill"/>
                        </IconButton>
                    </Tooltip><Tooltip title="Generate Invoice">
                        <Button
                            variant="outlined"
                            color={"secondary"}
                            sx={{"marginRight": "10px"}}
                            startIcon={<Iconify icon="map:finance"/>}
                            onClick={generateInvoice}
                        >
                            Generate Invoice
                        </Button>
                    </Tooltip></Box> :
                    deliverable ?
                        <Box>
                            <Tooltip title="Delete">
                                <IconButton onClick={deleteSelected}>
                                    <Iconify icon="eva:trash-2-fill"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Generate Invoice">
                                <Button
                                    variant="outlined"
                                    color={"secondary"}
                                    sx={{"marginRight": "10px"}}
                                    startIcon={<Iconify icon="map:finance"/>}
                                    onClick={confirmDelivery}
                                >
                                    Confirm Delivery
                                </Button>
                            </Tooltip>
                            <Tooltip title="Generate Invoice">
                                <Button
                                    variant="outlined"
                                    color={"secondary"}
                                    sx={{"marginRight": "10px"}}
                                    startIcon={<Iconify icon="map:finance"/>}
                                    onClick={generateCreditNote}
                                >
                                    Generate Credit Note
                                </Button>
                            </Tooltip>
                            <Tooltip title="Generate Invoice">
                                <Button
                                    variant="outlined"
                                    color={"secondary"}
                                    sx={{"marginRight": "10px"}}
                                    startIcon={<Iconify icon="map:finance"/>}
                                    onClick={generateDelivery}
                                >
                                    Generate Delivery Note
                                </Button>
                            </Tooltip>
                        </Box> :

                        <Tooltip title="Delete">
                            <IconButton onClick={deleteSelected}>
                                <Iconify icon="eva:trash-2-fill"/>
                            </IconButton>
                        </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list"/>
                    </IconButton>
                </Tooltip>
            )}
        </RootStyle>
    );
}
